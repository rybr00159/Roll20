'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync, spawnSync } = require('node:child_process');
const importer = require('../roll20/ChatGPTImporter');
const pc = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../examples/pc-mira.json'), 'utf8'));
const npc = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../examples/npc-ash-road-captain.json'), 'utf8'));
const mapped = data => { let i = 0; return importer.plan(data, () => '-row' + ++i).attributes; };
const value = (attrs, name) => attrs[name].current;

function sandbox(options = {}) {
    let next = 0;
    let attempts = 0;
    const objects = [];
    const messages = [];
    const handlers = {};
    const workers = [];
    const api = {
        on: (event, fn) => { handlers[event] = fn; },
        log: () => {},
        playerIsGM: id => id === 'gm',
        sendChat: (...args) => messages.push(args),
        findObjs: query => objects.filter(o => Object.entries(query).every(([key, val]) => o.get(key) === val)),
        createObj: (type, props) => {
            if (++attempts === options.failAt) return null;
            const data = { _type: type, ...props };
            const obj = {
                id: String(++next),
                get: (key, cb) => cb ? queueMicrotask(() => cb(data[key])) : data[key],
                set: values => Object.assign(data, values),
                setWithWorker: values => {
                    if (options.workerFailure) throw new Error('Worker scheduling failed');
                    workers.push({ name: data.name, before: data.current, after: values.current });
                    Object.assign(data, values);
                },
                remove: () => { const index = objects.indexOf(obj); if (index !== -1) objects.splice(index, 1); }
            };
            objects.push(obj);
            return obj;
        }
    };
    const runtime = importer.register(api);
    return {
        ...api, runtime, objects, messages, workers,
        command: (content, extra = {}) => handlers['chat:message']({ type: 'api', playerid: 'gm', content, ...extra }),
        characters: () => objects.filter(o => o.get('_type') === 'character'),
        attributes: () => objects.filter(o => o.get('_type') === 'attribute')
    };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('both complete examples validate without modifying the input', () => {
    for (const data of [pc(), npc()]) {
        const original = JSON.stringify(data);
        assert.deepEqual(importer.validate(data), []);
        mapped(data);
        assert.equal(JSON.stringify(data), original);
    }
});

test('PC core fields, proficiency and expertise do not double-count bonuses', () => {
    const data = pc(); data.skills.stealth = 'expertise';
    const attrs = mapped(data);
    assert.equal(value(attrs, 'npc'), '0');
    assert.deepEqual(attrs.hp, { current: '20', max: '20' });
    assert.equal(value(attrs, 'strength_mod'), '-1');
    assert.equal(value(attrs, 'intelligence_save_bonus'), '5');
    assert.equal(value(attrs, 'stealth_bonus'), '6');
    assert.equal(value(attrs, 'stealth_type'), '2');
    assert.equal(value(attrs, 'perception_bonus'), '1');
    assert.equal(value(attrs, 'passive_wisdom'), '11');
    assert.equal(value(attrs, 'custom_ac_base'), '12');
    assert.equal(value(attrs, 'custom_ac_part1'), 'none');
    assert.equal(value(attrs, 'hitdietype'), '6');
    assert.equal(value(attrs, 'cust_intelligence_save_prof'), '(@{pb})');
    assert.equal(value(attrs, 'rtype'), '{{normal=1}} {{r2=[[0d20');
});

test('NPC row data keeps multiattack, saves, negative skills and reactions separate', () => {
    const data = npc(); data.saving_throws.strength = 0; data.skills.arcana = -1;
    const attrs = mapped(data);
    assert.equal(value(attrs, 'npc_type'), 'Medium humanoid (human), Lawful neutral');
    assert.equal(value(attrs, 'npc_str_save_base'), '0');
    assert.notEqual(value(attrs, 'npc_str_save_flag'), '0');
    assert.equal(value(attrs, 'npc_arcana'), '-1');
    assert.equal(value(attrs, 'npc_hpformula'), '7d8+14');
    assert.equal(value(attrs, 'repeating_npcaction_-row2_name'), 'Multiattack');
    assert.equal(value(attrs, 'repeating_npcaction_-row2_attack_flag'), '0');
    assert.equal(value(attrs, 'repeating_npcaction_-row3_attack_tohit'), '5');
    assert.equal(value(attrs, 'repeating_npcaction_-row3_attack_damage'), '1d6+3');
    assert.equal(value(attrs, 'repeating_npcreaction_-row5_name'), 'Parry');
    assert.equal(value(attrs, 'npcreactionsflag'), '1');
    assert.equal(value(attrs, 'wtype'), '/w gm ');
});

test('legendary actions require a count and use their own repeating section', () => {
    const data = npc();
    data.legendary_actions = [{ name: 'Move', description: 'Move up to half speed.' }];
    assert.match(importer.validate(data).join(), /legendary_action_count/);
    data.legendary_action_count = 3;
    const attrs = mapped(data);
    assert.equal(value(attrs, 'npc_legendary_actions'), '3');
    assert.equal(value(attrs, 'repeating_npcaction-l_-row6_name'), 'Move');
});

test('PC attacks use supplied totals exactly once and permit a second damage type', () => {
    const data = pc(); data.attacks[0].damage2 = { dice: '1d6', type: 'fire' };
    const attrs = mapped(data);
    const prefix = 'repeating_attack_-row7_'; // two traits, four equipment rows, then attacks
    assert.equal(value(attrs, prefix + 'atkattr_base'), '0');
    assert.equal(value(attrs, prefix + 'atkprofflag'), '0');
    assert.equal(value(attrs, prefix + 'atkmod'), '4');
    assert.equal(value(attrs, prefix + 'dmgbase'), '1d4+2');
    assert.equal(value(attrs, prefix + 'dmgattr'), '0');
    assert.equal(value(attrs, prefix + 'dmg2base'), '1d6');
    assert.equal(value(attrs, '_reporder_repeating_attack'), '-row7,-row8');
});

test('spells, casting overrides, components and remaining slots use legacy attributes', () => {
    const data = pc(); data.spellcasting.attack_bonus = 7;
    const attrs = mapped(data);
    assert.equal(value(attrs, 'spellcasting_ability'), '@{intelligence_mod}+');
    assert.equal(value(attrs, 'spell_save_dc'), '13');
    assert.equal(value(attrs, 'globalmagicmod'), '2');
    assert.equal(value(attrs, 'spell_attack_bonus'), '7');
    assert.equal(value(attrs, 'lvl1_slots_total'), '4');
    assert.equal(value(attrs, 'lvl1_slots_expended'), '4');
    assert.equal(value(attrs, 'lvl9_slots_total'), '0');
    assert.equal(value(attrs, 'repeating_spell-cantrip_-row9_spellname'), 'Fire Bolt');
    assert.equal(value(attrs, 'repeating_spell-cantrip_-row9_spellcomp_v'), '{{v=1}}');
    assert.equal(value(attrs, 'repeating_spell-cantrip_-row9_spellcomp_m'), '0');
    assert.equal(value(attrs, 'repeating_spell-1_-row12_spelloutput'), 'SPELLCARD');
});

test('challenge and level determine default PB without rounding fractions upward', () => {
    const data = npc(); data.challenge = '1/8';
    assert.equal(value(mapped(data), 'pb'), '2');
    data.challenge = '9'; assert.equal(value(mapped(data), 'pb'), '4');
    const character = pc(); character.level = 20;
    assert.equal(value(mapped(character), 'pb'), '6');
});

test('NPC casting overrides and legendary attack rows remain independent of PC class settings', () => {
    const data = npc();
    data.spellcasting = { ability: 'wisdom', save_dc: 15, attack_bonus: 7, slots: { '1': 3 } };
    data.spells = pc().spells.slice(0, 1);
    data.legendary_action_count = 2;
    data.legendary_actions = [{ name: 'Strike', description: 'Costs 1 action.', attack: { to_hit: 5, damage: { dice: '1d6+3', type: 'piercing' } } }];
    const attrs = mapped(data);
    assert.equal(value(attrs, 'npcspellcastingflag'), '1');
    assert.equal(value(attrs, 'spell_save_dc'), '15');
    assert.equal(value(attrs, 'spell_dc_mod'), '4');
    assert.equal(value(attrs, 'globalmagicmod'), '4');
    assert.equal(value(attrs, 'lvl1_slots_expended'), '3');
    assert.equal(value(attrs, 'repeating_npcaction-l_-row6_attack_tohit'), '5');
    assert.equal(value(attrs, 'repeating_spell-cantrip_-row7_spellname'), 'Fire Bolt');
    assert.equal(attrs.custom_class, undefined);
});

test('plain JSON, code fences and handout HTML are parsed', () => {
    const data = npc(); data.bio = 'A & B < C. 50% chance.';
    const json = JSON.stringify(data, null, 2);
    assert.deepEqual(importer.parse(json), data);
    assert.deepEqual(importer.parse('```json\n' + json + '\n```'), data);
    const encoded = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').split('\n').map(line => '<p>' + line + '</p>').join('');
    assert.deepEqual(importer.parse(encoded, true), data);
    assert.deepEqual(importer.parse(encodeURIComponent(json), true), data);
    assert.deepEqual(importer.parse(json.replace(/"/g, '&#34;'), true), data);
});

test('malformed, oversized, unsupported and unsafe imports are rejected before any writes', () => {
    const cases = [null, [], {}, { ...pc(), schema_version: 2 }, { ...pc(), level: 21 },
        { ...pc(), controlledby: 'all' }, { ...pc(), multiclass: 'Rogue' },
        { ...pc(), skills: { arcana: 5 } }, { ...npc(), saving_throws: ['strength'] },
        { ...pc(), abilities: { strength: 10 } }, { ...pc(), name: '  ' },
        { ...pc(), hp: { max: 20, current: 21 } }, { ...pc(), bio: '@{some_character|secret}' },
        { ...pc(), bio: 'hi\n!another-mod --delete' }, { ...pc(), bio: '{{attack=1}}' }];
    for (const data of cases) {
        const api = sandbox();
        api.command('!gpt-import ' + JSON.stringify(data));
        assert.equal(api.objects.length, 0, JSON.stringify(data));
        assert.equal(api.messages.length, 1);
    }
    assert.throws(() => importer.parse('{bad json}'), /Invalid JSON/);
    assert.throws(() => importer.parse('x'.repeat(100001)), /100,000/);
});

test('dice expressions allow arithmetic but reject macros, huge dice and syntax errors', () => {
    for (const dice of ['1d8+3', '2d6 + 1d4 - 2', '4', '1d100']) {
        const data = pc(); data.attacks[0].damage.dice = dice;
        assert.deepEqual(importer.validate(data), []);
    }
    for (const dice of ['[[1d8]]', '1d8+@{strength_mod}', '1d8;!delete', '1000d20', '1d7', '']) {
        const data = pc(); data.attacks[0].damage.dice = dice;
        assert.ok(importer.validate(data).length);
    }
});

test('caster dependencies and PC save list are mandatory', () => {
    const data = pc(); delete data.spellcasting;
    assert.match(importer.validate(data).join(), /spellcasting/);
    const other = pc(); delete other.spellcasting.slots;
    assert.match(importer.validate(other).join(), /slots/);
    const third = pc(); delete third.saving_throws;
    assert.match(importer.validate(third).join(), /saving_throws/);
});

test('non-GM, non-API and unrelated commands cannot read handouts or write objects', () => {
    const api = sandbox();
    api.command('!gpt-import ' + JSON.stringify(pc()), { playerid: 'player' });
    api.command('!gpt-import-handout GPT Import', { playerid: 'player' });
    api.command('!gpt-import ' + JSON.stringify(pc()), { type: 'general' });
    api.command('!gpt-import-other ' + JSON.stringify(pc()));
    assert.equal(api.objects.length, 0); assert.equal(api.messages.length, 0);
});

test('check-only command creates nothing; import makes a private character with worker writes', () => {
    const api = sandbox();
    api.command('!gpt-check ' + JSON.stringify(pc()));
    assert.equal(api.objects.length, 0);
    assert.match(api.messages[0][1], /No sheet created/);
    api.command('!gpt-import ' + JSON.stringify(pc()));
    assert.equal(api.characters().length, 1);
    assert.equal(api.characters()[0].get('controlledby'), '');
    assert.equal(api.characters()[0].get('inplayerjournals'), '');
    assert.equal(api.workers.length, api.attributes().length);
    assert.ok(api.workers.filter(w => w.after !== '').every(w => w.before === ''));
    const ids = new Set(api.attributes().filter(a => a.get('name').startsWith('repeating_')).map(a => a.get('name').split('_').find(part => part.startsWith('-'))));
    assert.ok(ids.size > 5);
    assert.ok([...ids].every(id => id.length === 20 && !id.includes('_')));
    assert.ok(api.attributes().every(attr => attr.get('characterid') === api.characters()[0].id));
});

test('duplicate names are case-insensitive and do not modify the existing character', () => {
    const api = sandbox();
    const existing = api.createObj('character', { name: ' mira fenwick ', bio: 'Keep me' });
    api.command('!gpt-import ' + JSON.stringify(pc()));
    assert.equal(api.characters().length, 1);
    assert.equal(api.attributes().length, 0);
    assert.equal(existing.get('bio'), 'Keep me');
    assert.match(api.messages[0][1], /already exists/);
});

test('failed object creation and worker scheduling remove only new objects', () => {
    for (const options of [{ failAt: 1 }, { failAt: 10 }, { workerFailure: true }]) {
        const api = sandbox(options);
        api.command('!gpt-import ' + JSON.stringify(pc()));
        assert.equal(api.objects.length, 0);
        assert.match(api.messages[0][1], /Import failed/);
    }
    const api = sandbox({ failAt: 10 });
    const prior = api.createObj('character', { name: 'Original' });
    api.command('!gpt-import ' + JSON.stringify(npc()));
    assert.deepEqual(api.objects, [prior]);
});

test('handout import reads saved notes asynchronously and allows check-only', async () => {
    const api = sandbox();
    api.createObj('handout', { name: 'GPT Import', notes: '<p>' + JSON.stringify(npc()) + '</p>' });
    api.command('!gpt-check-handout'); await tick();
    assert.equal(api.characters().length, 0); assert.match(api.messages[0][1], /Valid NPC/);
    api.command('!gpt-import-handout GPT Import'); await tick();
    assert.equal(api.characters().length, 1);
    assert.equal(api.characters()[0].get('name'), 'Ash Road Captain');
});

test('missing, ambiguous and invalid handouts give errors without creating characters', async () => {
    const api = sandbox();
    api.command('!gpt-import-handout Missing');
    api.createObj('handout', { name: 'Bad', notes: '<p>not json</p>' });
    api.command('!gpt-import-handout Bad'); await tick();
    api.createObj('handout', { name: 'Duplicate', notes: '{}' });
    api.createObj('handout', { name: 'Duplicate', notes: '{}' });
    api.command('!gpt-import-handout Duplicate');
    assert.equal(api.characters().length, 0);
    assert.match(api.messages[0][1], /found 0/);
    assert.match(api.messages[1][1], /Invalid JSON/);
    assert.match(api.messages[2][1], /found 2/);
});

test('inline roll substitutions are rejected in chat imports', () => {
    const api = sandbox();
    api.command('!gpt-import ' + JSON.stringify(pc()), { inlinerolls: [{ results: { total: 8 } }] });
    assert.equal(api.objects.length, 0);
    assert.match(api.messages[0][1], /Inline rolls/);
});

test('bio and feedback escape HTML and do not send executable content', () => {
    const api = sandbox(); const data = npc();
    data.name = '<b>Captain</b>'; data.bio = '<script>alert(1)</script>\nSecond line';
    api.command('!gpt-import ' + JSON.stringify(data));
    assert.equal(api.characters()[0].get('bio'), '&lt;script&gt;alert(1)&lt;/script&gt;<br>Second line');
    assert.match(api.messages[0][1], /&lt;b&gt;Captain&lt;\/b&gt;/);
    assert.equal(api.messages[0][3].noarchive, true);
});

test('standalone pasteable file registers in a VM without Node globals or dependencies', () => {
    const api = sandbox(); const handlers = {};
    const context = { ...api, on: (name, fn) => { handlers[name] = fn; } };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../roll20/ChatGPTImporter.js'), 'utf8'), context);
    handlers.ready();
    handlers['chat:message']({ type: 'api', playerid: 'gm', content: '!gpt-import ' + JSON.stringify(npc()) });
    assert.equal(api.characters().length, 1);
});

test('published JSON schema matches the runtime schema', () => {
    const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/character.schema.json'), 'utf8'));
    assert.deepEqual(schema, importer.SCHEMA);
});

test('CLI validates real examples and returns failure for invalid files', () => {
    const root = path.join(__dirname, '..');
    const output = execFileSync(process.execPath, ['tools/validate.js', 'examples/pc-mira.json', 'examples/npc-ash-road-captain.json'], { cwd: root, encoding: 'utf8' });
    assert.match(output, /valid PC/); assert.match(output, /valid NPC/);
    const result = spawnSync(process.execPath, ['tools/validate.js', 'package.json'], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 1); assert.match(result.stderr, /must be pc or npc/);
});
