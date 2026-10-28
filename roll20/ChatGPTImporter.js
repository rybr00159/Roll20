/* ChatGPT Importer v1.0.0 — MIT License. Paste this entire file into a Roll20 Mod.
 * Target: D&D 5E by Roll20 (2014 / legacy OGL), not the D&D 2024 or Shaped sheet.
 * No external libraries, network calls, or API keys. Source and tests live together.
 */
var Roll20GPTImporter = (function () {
    'use strict';
    const VERSION = '1.0.0';
    const MAX_INPUT = 100000;
    const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    const SKILLS = {
        acrobatics: 'dexterity', animal_handling: 'wisdom', arcana: 'intelligence',
        athletics: 'strength', deception: 'charisma', history: 'intelligence',
        insight: 'wisdom', intimidation: 'charisma', investigation: 'intelligence',
        medicine: 'wisdom', nature: 'intelligence', perception: 'wisdom',
        performance: 'charisma', persuasion: 'charisma', religion: 'intelligence',
        sleight_of_hand: 'dexterity', stealth: 'dexterity', survival: 'wisdom'
    };
    const CLASSES = {
        Barbarian: 'd12', Bard: 'd8', Cleric: 'd8', Druid: 'd8', Fighter: 'd10',
        Monk: 'd8', Paladin: 'd10', Ranger: 'd10', Rogue: 'd8', Sorcerer: 'd6',
        Warlock: 'd8', Wizard: 'd6'
    };
    const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
    const text = (max = 4000) => ({ type: 'string', maxLength: max });
    const number = (min, max, type = 'integer') => ({ type, minimum: min, maximum: max });
    const choice = values => ({ type: 'string', enum: values });
    const object = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });
    const list = (items, max = 100) => ({ type: 'array', items, maxItems: max });
    const namedText = object({ name: { ...text(120), minLength: 1 }, description: text(), source: text(120) }, ['name', 'description']);
    // Only arithmetic dice expressions; never Roll20 commands, queries or attribute references.
    const dice = { ...text(100), pattern: '^(?:[1-9][0-9]{0,2}d(?:4|6|8|10|12|20|100)|[0-9]{1,5})(?:\\s*[+-]\\s*(?:[1-9][0-9]{0,2}d(?:4|6|8|10|12|20|100)|[0-9]{1,5}))*$' };
    const damage = object({ dice, type: text(80) }, ['dice', 'type']);
    const attack = object({
        name: { ...text(120), minLength: 1 }, to_hit: number(-20, 50),
        kind: choice(['Melee', 'Ranged']), range: text(120), target: text(120),
        damage, damage2: damage, description: text()
    }, ['name', 'to_hit', 'damage']);
    const spell = object({
        name: { ...text(120), minLength: 1 }, level: number(0, 9),
        school: choice(['abjuration', 'conjuration', 'divination', 'enchantment', 'evocation', 'illusion', 'necromancy', 'transmutation']),
        casting_time: text(120), range: text(120), target: text(120),
        components: text(40), materials: text(500), duration: text(120),
        concentration: { type: 'boolean' }, ritual: { type: 'boolean' },
        prepared: { type: 'boolean' }, description: text(), higher_levels: text(2000)
    }, ['name', 'level', 'school', 'casting_time', 'range', 'components', 'duration', 'description']);
    const common = {
        schema_version: { type: 'integer', enum: [1] }, name: { ...text(120), minLength: 1 },
        abilities: object(Object.fromEntries(ABILITIES.map(a => [a, number(1, 30)])), ABILITIES),
        hp: object({ max: number(1, 10000), current: number(0, 10000), temp: number(0, 10000), formula: dice }, ['max']),
        ac: object({ value: number(0, 40), type: text(200) }, ['value']),
        speed: text(200), alignment: text(120), bio: text(10000), languages: text(500),
        traits: list(namedText), spells: list(spell, 150),
        spellcasting: object({
            ability: choice(ABILITIES), save_dc: number(1, 40), attack_bonus: number(-20, 50),
            slots: object(Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i + 1), number(0, 20)])))
        }, ['ability']),
        proficiency_bonus: number(2, 10)
    };
    const pcSchema = object({
        ...common, type: choice(['pc']), class: choice(Object.keys(CLASSES)), level: number(1, 20),
        race: text(120), subclass: text(120), background: text(120), xp: number(0, 10000000),
        saving_throws: { ...list(choice(ABILITIES), 6), uniqueItems: true },
        skills: object(Object.fromEntries(Object.keys(SKILLS).map(s => [s, choice(['proficient', 'expertise'])]))),
        attacks: list(attack), proficiencies: text(2000),
        equipment: list(object({ name: { ...text(120), minLength: 1 }, quantity: number(1, 10000),
            weight: number(0, 10000, 'number'), description: text() }, ['name']))
    }, ['schema_version', 'type', 'name', 'abilities', 'hp', 'ac', 'speed', 'class', 'level', 'saving_throws']);
    const npcAttackSchema = object(Object.fromEntries(Object.entries(attack.properties).filter(([key]) => !['name', 'description'].includes(key))), ['to_hit', 'damage']);
    const npcSchema = object({
        ...common, type: choice(['npc']), size: text(40), creature_type: text(120),
        challenge: choice(['0', '1/8', '1/4', '1/2', ...Array.from({ length: 30 }, (_, i) => String(i + 1))]),
        xp: number(0, 10000000), senses: text(500),
        vulnerabilities: text(500), resistances: text(500), immunities: text(500), condition_immunities: text(500),
        saving_throws: object(Object.fromEntries(ABILITIES.map(a => [a, number(-20, 50)]))),
        skills: object(Object.fromEntries(Object.keys(SKILLS).map(s => [s, number(-20, 50)]))),
        actions: list(object({ name: { ...text(120), minLength: 1 }, description: text(), attack: npcAttackSchema }, ['name', 'description'])),
        reactions: list(namedText), legendary_actions: list(object({ name: { ...text(120), minLength: 1 }, description: text(), attack: npcAttackSchema }, ['name', 'description'])),
        legendary_action_count: number(1, 10)
    }, ['schema_version', 'type', 'name', 'abilities', 'hp', 'ac', 'speed', 'size', 'creature_type', 'challenge']);
    const SCHEMA = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        title: 'Roll20 ChatGPT Import v1 — 2014 legacy sheet',
        description: 'One character per import. Text must not contain Roll20 macro syntax. See docs/FORMAT.md for semantic constraints.',
        oneOf: [pcSchema, npcSchema]
    };

    function check(value, schema, path, errors) {
        if (errors.length >= 15) return;
        const actual = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
        const validType = schema.type === 'integer' ? Number.isInteger(value)
            : schema.type === 'number' ? typeof value === 'number' && Number.isFinite(value)
            : actual === schema.type;
        if (!validType) { errors.push(path + ': expected ' + schema.type); return; }
        if (schema.enum && !schema.enum.includes(value)) errors.push(path + ': expected ' + schema.enum.join(', '));
        if (typeof value === 'string') {
            if (value.length > schema.maxLength || value.trim().length < (schema.minLength || 0)) errors.push(path + ': invalid text length');
            if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(path + ': use dice such as 1d8+3 or 2d6+1d4+2');
            if (/@\{|%\{|\?\{|&\{|\[\[|\]\]|\{\{|\}\}|(?:^|\n)\s*[!\/]|[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
                errors.push(path + ': use plain text, without Roll20 macros, template syntax, or command lines');
            }
        }
        if (typeof value === 'number' && (value < schema.minimum || value > schema.maximum)) errors.push(path + ': out of range');
        if (actual === 'object') {
            schema.required.forEach(k => { if (!own(value, k)) errors.push(path + '.' + k + ': required'); });
            Object.keys(value).forEach(k => {
                if (!own(schema.properties, k)) errors.push(path + '.' + k + ': unsupported field');
                else check(value[k], schema.properties[k], path + '.' + k, errors);
            });
        }
        if (actual === 'array') {
            if (value.length > schema.maxItems) errors.push(path + ': too many entries');
            if (schema.uniqueItems && new Set(value).size !== value.length) errors.push(path + ': duplicate entries');
            value.forEach((v, i) => check(v, schema.items, path + '[' + i + ']', errors));
        }
    }

    function validate(data) {
        const errors = [];
        if (!data || (data.type !== 'pc' && data.type !== 'npc')) return ['character.type: must be pc or npc (one JSON object per import)'];
        check(data, data.type === 'pc' ? pcSchema : npcSchema, 'character', errors);
        if (!errors.length) {
            if (data.hp.current !== undefined && data.hp.current > data.hp.max) errors.push('character.hp.current: cannot exceed max');
            if (data.spells && data.spells.length && !data.spellcasting) errors.push('character.spellcasting: required when spells are supplied');
            if (data.type === 'pc' && data.spellcasting && !data.spellcasting.slots) errors.push('character.spellcasting.slots: supply slot totals for a PC caster ({} for no slots)');
            if (data.legendary_actions && data.legendary_actions.length && !data.legendary_action_count) errors.push('character.legendary_action_count: required for legendary actions');
            if (/[\r\n]/.test(data.name)) errors.push('character.name: must be a single line');
        }
        return errors.slice(0, 15);
    }

    function parse(raw, html) {
        if (typeof raw !== 'string' || raw.length > MAX_INPUT) throw new Error('Import must be text under 100,000 characters.');
        let content = raw.trim();
        // Some older notes values are URI encoded. Never decode normal text containing %.
        if (/^%7b/i.test(content)) {
            try { content = decodeURIComponent(content); } catch (_) { throw new Error('Invalid URI-encoded handout notes.'); }
        }
        if (html) {
            content = content.replace(/<br\s*\/?\s*>|<\/(?:p|div|li)>/gi, '\n').replace(/<[^>]*>/g, '');
            content = content.replace(/&(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/gi, entity => {
                const key = entity.slice(1, -1).toLowerCase();
                const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
                if (own(named, key)) return named[key];
                const cp = key[1] === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
                return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : entity;
            });
        }
        content = content.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i, '$1').trim();
        let data;
        try { data = JSON.parse(content); } catch (_) { throw new Error('Invalid JSON. Paste only the complete JSON object; use straight double quotes and no trailing commas.'); }
        const errors = validate(data);
        if (errors.length) throw new Error(errors.join('\n'));
        return data;
    }

    const mod = value => Math.floor((value - 10) / 2);
    const signed = value => (value >= 0 ? '+' : '') + value;
    const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

    // Pure mapping: no Roll20 writes occur until validation and the whole plan complete.
    function plan(data, rowId) {
        const errors = validate(data);
        if (errors.length) throw new Error(errors.join('\n'));
        const a = Object.create(null);
        const put = (name, current, max) => { a[name] = { current: String(current), ...(max === undefined ? {} : { max: String(max) }) }; };
        const row = (section, fields) => {
            const id = rowId();
            Object.keys(fields).forEach(key => put('repeating_' + section + '_' + id + '_' + key, fields[key]));
            const order = '_reporder_repeating_' + section;
            put(order, a[order] ? a[order].current + ',' + id : id);
        };
        const pc = data.type === 'pc';
        const cr = data.challenge ? (data.challenge.includes('/') ? 0 : Number(data.challenge)) : 0;
        const pb = data.proficiency_bonus || (2 + Math.floor(((pc ? data.level : Math.max(1, cr)) - 1) / 4));
        put('npc', pc ? 0 : 1);
        put('character_name', data.name.trim());
        put('l1mancer_status', 'completed');
        put('mancer_status', 'completed');
        put('level_calculations', 'off'); // Imported snapshot: preserve supplied save proficiencies and spell slots.
        put('pb_type', 'custom'); put('pb_custom', pb); put('pb', pb);
        put('hp', data.hp.current === undefined ? data.hp.max : data.hp.current, data.hp.max);
        put('hp_temp', data.hp.temp || 0);
        put('speed', data.speed);
        put('ac', data.ac.value);
        put('alignment', data.alignment || '');
        put('wtype', pc ? '' : '/w gm ');
        put('rtype', '{{normal=1}} {{r2=[[0d20'); put('dtype', 'full'); put('d20', '1d20');
        put('initiative_style', '@{d20}'); put('initmod', 0);
        put('initiative_bonus', mod(data.abilities.dexterity));
        put('charname_output', '{{charname=@{character_name}}}');
        ABILITIES.forEach(ability => {
            put(ability + '_base', data.abilities[ability]);
            put(ability, data.abilities[ability]); put(ability + '_mod', mod(data.abilities[ability]));
        });
        if (pc) {
            put('class', data.class); put('base_level', data.level); put('level', data.level);
            put('class_display', data.class + ' ' + data.level);
            put('subclass', data.subclass || ''); put('race', data.race || '');
            put('background', data.background || ''); put('experience', data.xp || 0);
            put('hitdietype', CLASSES[data.class].slice(1)); put('hit_dice', data.level, data.level);
            // The legacy class worker otherwise replaces supplied saves and subclass casting ability.
            put('custom_class', 1); put('cust_classname', data.class);
            put('cust_hitdietype', CLASSES[data.class].slice(1));
            put('cust_spellcasting_ability', data.spellcasting ? '@{' + data.spellcasting.ability + '_mod}+' : '0*');
            put('custom_ac_flag', 1); put('custom_ac_base', data.ac.value);
            put('custom_ac_part1', 'none'); put('custom_ac_part2', 'none'); put('custom_ac_shield', 'no');
            put('other_proficiencies_and_languages', [data.proficiencies, data.languages].filter(Boolean).join('\n'));
            put('simpleproficencies', 'simple'); put('simpletraits', 'complex'); put('simpleinventory', 'complex');
            ABILITIES.forEach(ability => {
                const trained = (data.saving_throws || []).includes(ability);
                put(ability + '_save_prof', trained ? '(@{pb})' : 0);
                put('cust_' + ability + '_save_prof', trained ? '(@{pb})' : 0);
                put(ability + '_save_bonus', mod(data.abilities[ability]) + (trained ? pb : 0));
            });
            Object.keys(SKILLS).forEach(skill => {
                const training = (data.skills || {})[skill];
                const factor = training === 'expertise' ? 2 : training === 'proficient' ? 1 : 0;
                put(skill + '_prof', factor ? '(@{pb}*@{' + skill + '_type})' : 0);
                put(skill + '_type', factor === 2 ? 2 : 1);
                put(skill + '_bonus', mod(data.abilities[SKILLS[skill]]) + factor * pb);
            });
            put('passive_wisdom', 10 + Number(a.perception_bonus.current));
            (data.traits || []).forEach(t => row('traits', { name: t.name, description: t.description,
                source: t.source || 'Other', source_type: '', 'options-flag': 0 }));
            (data.equipment || []).forEach(item => row('inventory', { itemname: item.name,
                itemcount: item.quantity || 1, itemweight: item.weight || 0, itemcontent: item.description || '',
                equipped: '1', itemmodifiers: '', 'options-flag': 0 }));
            (data.attacks || []).forEach(atk => row('attack', pcAttack(atk)));
        } else {
            put('npc_name', data.name.trim()); put('npc_options-flag', 0); put('npc_name_flag', '{{name=@{npc_name}}}');
            put('npc_type', [data.size + ' ' + data.creature_type, data.alignment].filter(Boolean).join(', '));
            put('npc_ac', data.ac.value); put('npc_actype', data.ac.type || '');
            put('npc_hpformula', data.hp.formula || String(data.hp.max)); put('npc_speed', data.speed);
            put('npc_challenge', data.challenge); put('npc_xp', data.xp === undefined ? '' : data.xp);
            ['senses', 'languages', 'vulnerabilities', 'resistances', 'immunities', 'condition_immunities'].forEach(k => put('npc_' + k, data[k] || ''));
            let saveSeen = false;
            ABILITIES.forEach(ability => {
                const key = 'npc_' + ability.slice(0, 3) + '_save';
                const value = (data.saving_throws || {})[ability];
                put(key + '_base', value === undefined ? '' : value); put(key, value === undefined ? '' : value);
                put(key + '_flag', value === undefined ? 0 : (saveSeen ? 1 : 2) + (value < 0 ? 2 : 0));
                if (value !== undefined) saveSeen = true;
            });
            put('npc_saving_flag', saveSeen ? '1' : '');
            let skillSeen = false;
            Object.keys(SKILLS).forEach(skill => {
                const value = (data.skills || {})[skill];
                put('npc_' + skill + '_base', value === undefined ? '' : value);
                put('npc_' + skill, value === undefined ? '' : value);
                put('npc_' + skill + '_flag', value === undefined ? 0 : (skillSeen ? 1 : 2) + (value < 0 ? 2 : 0));
                if (value !== undefined) skillSeen = true;
            });
            put('npc_skills_flag', skillSeen ? '1' : '');
            (data.traits || []).forEach(t => row('npctrait', { name: t.name, desc: t.description, 'npc_options-flag': 0 }));
            (data.actions || []).forEach(action => row('npcaction', npcAction(action)));
            (data.reactions || []).forEach(t => row('npcreaction', { name: t.name, desc: t.description, 'npc_options-flag': 0 }));
            put('npcreactionsflag', (data.reactions || []).length ? 1 : 0);
            put('npc_legendary_actions', (data.legendary_actions || []).length ? data.legendary_action_count : 0);
            (data.legendary_actions || []).forEach(action => row('npcaction-l', npcAction(action)));
        }
        if (data.spellcasting) {
            const casting = data.spellcasting;
            const abilityMod = mod(data.abilities[casting.ability]);
            put('spellcasting_ability', '@{' + casting.ability + '_mod}+');
            put('spell_dc_mod', casting.save_dc === undefined ? 0 : casting.save_dc - 8 - pb - abilityMod);
            put('spell_attack_mod', casting.attack_bonus === undefined ? 0 : casting.attack_bonus - pb - abilityMod);
            put('globalmagicmod', casting.attack_bonus === undefined ? 0 : casting.attack_bonus - pb - abilityMod);
            put('spell_save_dc', casting.save_dc === undefined ? 8 + pb + abilityMod : casting.save_dc);
            put('spell_attack_bonus', casting.attack_bonus === undefined ? pb + abilityMod : casting.attack_bonus);
            put('npcspellcastingflag', pc ? 0 : 1);
            for (let i = 1; i <= 9; i++) {
                const count = (casting.slots || {})[i] || 0;
                put('lvl' + i + '_slots_total', count); put('lvl' + i + '_slots_expended', count);
            }
        }
        (data.spells || []).forEach(s => {
            const fields = { spellname: s.name, spelllevel: s.level || 'cantrip', spellschool: s.school,
                spellcastingtime: s.casting_time, spellrange: s.range, spelltarget: s.target || '',
                spellduration: s.duration, spelldescription: s.description, spellathigherlevels: s.higher_levels || '',
                spellprepared: s.prepared ? 1 : 0, spelloutput: 'SPELLCARD', spell_ability: 'spell',
                spellcomp_materials: s.materials || '', spellritual: s.ritual ? '{{ritual=1}}' : 0,
                spellconcentration: s.concentration ? '{{concentration=1}}' : 0, 'options-flag': 0 };
            ['v', 's', 'm'].forEach(c => { fields['spellcomp_' + c] = s.components.toLowerCase().includes(c) ? '{{' + c + '=1}}' : 0; });
            row('spell-' + (s.level || 'cantrip'), fields);
        });
        return { name: data.name.trim(), attributes: a, bio: escapeHtml(data.bio || '').replace(/\n/g, '<br>'), type: data.type };
    }

    function pcAttack(atk) {
        return {
            atkname: atk.name, atkflag: '{{attack=1}}', atkattr_base: '0', atkmod: atk.to_hit,
            atkprofflag: '0', atkmagic: 0, atkcritrange: 20, atkrange: atk.range || '',
            dmgflag: '{{damage=1}} {{dmg1flag=1}}', dmgbase: atk.damage.dice, dmgattr: '0', dmgmod: 0,
            dmgtype: atk.damage.type, dmg2flag: atk.damage2 ? '{{damage=1}} {{dmg2flag=1}}' : 0,
            dmg2base: atk.damage2 ? atk.damage2.dice : '', dmg2attr: '0', dmg2mod: 0,
            dmg2type: atk.damage2 ? atk.damage2.type : '', atk_desc: [atk.kind, atk.target, atk.description].filter(Boolean).join('. '),
            atkbonus: signed(atk.to_hit), atkdmgtype: atk.damage.dice + ' ' + atk.damage.type,
            saveflag: 0, 'options-flag': 0
        };
    }

    function npcAction(action) {
        const fields = { name: action.name, description: action.description,
            show_desc: '@{description}', attack_flag: action.attack ? 'on' : 0, 'npc_options-flag': 0 };
        if (action.attack) {
            const atk = action.attack;
            Object.assign(fields, { attack_type: atk.kind || 'Melee', attack_range: atk.range || '5 ft.',
                attack_target: atk.target || 'one target', attack_tohit: atk.to_hit,
                attack_damage: atk.damage.dice, attack_damagetype: atk.damage.type,
                attack_damage2: atk.damage2 ? atk.damage2.dice : '', attack_damagetype2: atk.damage2 ? atk.damage2.type : '' });
        }
        return fields;
    }

    function register(api) {
        let counter = 0;
        // Legacy sheet workers extract row IDs with fixed 20-character substrings.
        const rowId = () => ('-' + Date.now().toString(36).padStart(9, '0') +
            (++counter).toString(36).padStart(5, '0') + Math.random().toString(36).slice(2, 7).padEnd(5, '0')).slice(0, 20);
        const tell = message => api.sendChat('GPT Importer', '/w gm ' + escapeHtml(message).replace(/\n/g, '<br>'), null, { noarchive: true });
        const help = () => tell('GPT Importer ' + VERSION + '\nPaste JSON into a handout named GPT Import and save it.\n!gpt-check-handout GPT Import — validate only\n!gpt-import-handout GPT Import — create new sheet\nOr: !gpt-check {JSON} / !gpt-import {JSON}\nGM only. Legacy D&D 5E by Roll20 (2014). No overwrites.');
        const importData = (data, checkOnly) => {
            const mapped = plan(data, rowId);
            const duplicate = api.findObjs({ _type: 'character' }).some(c => String(c.get('name')).trim().toLowerCase() === mapped.name.toLowerCase());
            if (duplicate) throw new Error('A character named "' + mapped.name + '" already exists. Change the JSON name to import another copy.');
            if (checkOnly) {
                tell('Valid ' + data.type.toUpperCase() + ': ' + mapped.name + ' (' + Object.keys(mapped.attributes).length + ' attributes). No sheet created.');
                return;
            }
            let character;
            const created = [];
            try {
                character = api.createObj('character', { name: mapped.name, bio: mapped.bio, controlledby: '', inplayerjournals: '' });
                if (!character) throw new Error('Roll20 could not create the character.');
                // Create all inputs first, then invoke sheet workers so each worker can read the entire import.
                Object.keys(mapped.attributes).forEach(name => {
                    const attr = api.createObj('attribute', { characterid: character.id, name, current: '', max: '' });
                    if (!attr) throw new Error('Roll20 could not create attribute ' + name);
                    created.push({ attr, value: mapped.attributes[name] });
                });
                // Each value transitions from blank, triggering change events. Workers run asynchronously
                // after this handler, when all inputs have been populated.
                created.forEach(entry => entry.attr.setWithWorker(entry.value));
            } catch (error) {
                created.forEach(entry => entry.attr.remove());
                if (character) character.remove();
                throw new Error('Import failed; new objects were removed. ' + error.message);
            }
            tell('Created ' + data.type.toUpperCase() + ': ' + mapped.name + '. Open the sheet and allow workers to finish. Check HP, AC, saves, attacks and spells. PCs are private until you assign player access in Edit.');
        };
        const safely = work => { try { work(); } catch (error) { tell(error.message); } };
        api.on('chat:message', msg => {
            if (msg.type !== 'api' || typeof msg.content !== 'string' || !/^!gpt-(?:help|import|check)(?:-handout)?(?:\s|$)/.test(msg.content)) return;
            if (!api.playerIsGM(msg.playerid)) return;
            safely(() => {
                const match = msg.content.match(/^(!\S+)(?:\s+([\s\S]*))?$/);
                const command = match[1];
                const input = (match[2] || '').trim();
                if (command === '!gpt-help' || !input && !command.endsWith('-handout')) return help();
                if (!['!gpt-import', '!gpt-check', '!gpt-import-handout', '!gpt-check-handout'].includes(command)) return help();
                const checkOnly = command.startsWith('!gpt-check');
                if (command.endsWith('-handout')) {
                    const name = input || 'GPT Import';
                    const handouts = api.findObjs({ _type: 'handout', name });
                    if (handouts.length !== 1) throw new Error('Expected one handout named "' + name + '"; found ' + handouts.length + '. Use a unique name.');
                    handouts[0].get('notes', notes => safely(() => importData(parse(notes, true), checkOnly)));
                } else {
                    // Roll20 expands inline rolls before scripts receive chat messages.
                    if (msg.inlinerolls || /\$\[\[\d+\]\]/.test(input)) throw new Error('Inline rolls are not import data. Use plain dice such as 1d8+3.');
                    importData(parse(input, false), checkOnly);
                }
            });
        });
        api.log('GPT Importer v' + VERSION + ' ready. GM command: !gpt-help');
        return { importData };
    }
    return { VERSION, SCHEMA, validate, parse, plan, register };
}());

if (typeof module !== 'undefined' && module.exports) module.exports = Roll20GPTImporter;
if (typeof on === 'function') {
    on('ready', function () {
        Roll20GPTImporter.register({ on, sendChat, playerIsGM, findObjs, createObj, log });
    });
}
