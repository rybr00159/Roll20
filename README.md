# ChatGPT → Roll20 (2014 5e)

Generate a character in ChatGPT or Codex, paste its JSON into a Roll20 handout, and run one command to create its character sheet. No OpenAI API key, website, extension, or paid AI integration is needed.

**Requires a Roll20 Pro game with Mods (API scripts) and the legacy “D&D 5E by Roll20” sheet using 2014 rules.** It does not target the D&D 2024, Shaped, or other community sheets. “Legacy” alone is not sufficient: check the game’s actual sheet selection. Roll20’s interface may label this sheet “D&D 5E (2014) by Roll20.”

## Install once

1. Open the game’s **Mods (API Scripts)** page. Add a new script named `ChatGPT Importer`.
2. Copy all of [roll20/ChatGPTImporter.js](roll20/ChatGPTImporter.js) into the editor, then save. Install only one copy. No dependencies or companion script are required.
3. Launch the game as GM and enter `!gpt-help` in chat. A private help message confirms the script is running.

## Import a character

1. In Codex, ask: **“Use this repository’s generator prompt to create a level 3 human wizard under 2014 rules. Save the import JSON and validate it.”** For ChatGPT outside this repository, paste [prompts/generate-character.md](prompts/generate-character.md), the format guide, and an example before describing your character.
2. In the Roll20 Journal, create a handout named **GPT Import**. Keep it private. Click **Edit** and paste the generated JSON into **Description & Notes**. Save the handout. Do not use GM Notes for the payload.
3. Enter `!gpt-check-handout GPT Import` in chat. This validates the data and checks for a duplicate character name without creating anything.
4. Enter `!gpt-import-handout GPT Import`. Open the new character in the Journal and allow its sheet workers to finish.
5. Check HP, AC, saves, one attack, and any spells using [the first-import checklist](docs/TESTING.md). For a PC, use the character’s **Edit** window to assign **In Player’s Journals** and **Can Be Edited & Controlled By** to the appropriate player.

You can reuse the same handout for the next character. Import one character at a time. Existing character names are refused, including case-only differences. Change the JSON `name` to import a new copy. Imports never edit an existing sheet.

Try the included examples first:

- [Mira Fenwick](examples/pc-mira.json): a level 3 wizard with equipment, traits, spell cards, and attacks.
- [Ash Road Captain](examples/npc-ash-road-captain.json): an original NPC with multiattack, weapon attacks, skills, and a reaction.

For complete level 7 PCs, see [Rowan, the Twilight Cleric](docs/characters/rowan-ashveil-level7.md) and [five Grim Hollow characters](docs/characters/grim-hollow-five.md). Each guide includes a validated import file, ability-score progression, magic items, spending ledger, tactics, and required manual sheet settings. The Grim Hollow group uses backgrounds without feats and house-rule feats without ability-score increases.

[Four more PCs](docs/characters/grim-hollow-four-more.md) add an Inquisition Cleric, Gloom Stalker Ranger, Shepherd Druid, and Divination Wizard under those same restrictions, each using a Player Pack subclass or magic item.

For a small character, paste a **single line** directly into chat: `!gpt-import {"schema_version":1,...}`. Use the handout route for normal characters, multiline JSON, or any chat length/formatting trouble. There is no chat chunking or remote download step.

## Commands

| Command | Result |
| --- | --- |
| `!gpt-help` | Installation/help message |
| `!gpt-check-handout GPT Import` | Validate a saved handout; no sheet created |
| `!gpt-import-handout GPT Import` | Create a character from that handout |
| `!gpt-check {JSON}` | Validate direct JSON; no sheet created |
| `!gpt-import {JSON}` | Create a character from direct JSON |

All commands are GM-only. Handout names are matched exactly, without quotation marks. If omitted after a `-handout` command, the default is `GPT Import`. Ambiguous handout names are refused.

## What imports

PCs: one standard 2014 class, level, subclass label, race, background, ability scores, HP, fixed custom AC, saves, proficient/expertise skills, languages/proficiencies, equipment, traits, attack rows, spell cards, casting statistics, and supplied spell-slot totals.

NPCs: size/type/alignment, CR and optional XP, abilities, HP and hit dice formula, AC, speed, saves/skills, senses, languages, defenses, traits, action/attack rows, reactions, legendary actions, and optional spell cards/casting statistics.

Read [docs/FORMAT.md](docs/FORMAT.md) for supported fields and [docs/character.schema.json](docs/character.schema.json) for the full machine-readable schema.

## Limits to know

- This is a **snapshot importer**, not a rules engine or Charactermancer. It validates structure and ranges, but does not prove that a generated character, spell description, or challenge rating is rules-correct. Review AI output.
- PCs use the sheet’s custom-class configuration to preserve supplied save proficiencies and casting ability. Level calculations are off and PB is custom. AC is a fixed custom value. Change those settings yourself if you want automatic sheet advancement later.
- To-hit totals and damage formulas are imported literally; no ability or proficiency bonus is added again. Update attack totals, AC, PB, HP, and spell slots when the character changes. Equipment has no automatic mechanical modifiers or attack links.
- Spells are readable, clickable **spell cards**. A card does not automatically roll damage, make saves, apply effects, or spend slots. Add attack spells as separate `attacks` (PC) or `actions` (NPC) when you want an attack button. Handle save-based spell damage normally in Roll20.
- Multiclassing, custom classes, 2024 rules, feats with automated effects, resource tracking, token art/default tokens, bulk imports, and updates to existing characters are outside v1. Traits can preserve plain-text reminders of features and feats.
- Characters start private. NPC rolls whisper to the GM; PC rolls are public. No external requests or secrets are used. The Mod sandbox has no supported direct connection to ChatGPT, so the saved handout is the transfer step.

## Development

Node.js 20 or newer; no dependency installation is needed.

```sh
npm test
npm run validate -- examples/pc-mira.json examples/npc-ash-road-captain.json
npm run schema  # refresh the JSON Schema after changing runtime definitions
```

The file you paste into Roll20 is the canonical source; there is no build step. Tests exercise it in a mocked Roll20 object store and in a Node-free VM. **Automated tests do not run Roll20’s hosted sheet workers or game UI.** See [docs/TESTING.md](docs/TESTING.md) for the live verification still needed in your game.
