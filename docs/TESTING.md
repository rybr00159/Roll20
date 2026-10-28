# Verification and first live import

Run `npm test` and `npm run validate -- examples/pc-mira.json examples/npc-ash-road-captain.json` locally. Node 20+ is required; there are no dependencies.

The automated tests cover parsing plain/HTML handout content, validation errors, PC/NPC mappings, caster data, skills/expertise, final attack totals, GM-only commands, private characters, duplicate refusal, dry runs, asynchronous handout reads, cleanup on synchronous creation/scheduling failures, schema consistency, CLI outcomes, and loading the standalone script without Node globals.

The test object store does **not** implement Roll20's hosted sheet workers or UI. Live sheet compatibility cannot be proven by a passing mock test. The target is the legacy OGL sheet; some field conventions were cross-checked against the public OGL companion and its community derivative, 5e Darker Dungeons. That derivative is research material, not a supported alternative sheet.

During initial development, the public derivative's worker code was also run in a temporary local event-loop simulation against both example imports. It produced attack roll macros and preserved the examples' PC AC/saves/casting/slots and NPC action totals. This caught its fixed 20-character row-ID assumption. It was not a hosted Roll20 test and does not replace the checklist below. Reference sources:

- [Official OGL companion 1.4.5](https://github.com/Roll20/roll20-api-scripts/tree/master/5th%20Edition%20OGL%20by%20Roll20%20Companion/1.4.5) for HP/slot attribute conventions.
- [5e Darker Dungeons at the inspected source revision](https://github.com/Roll20/roll20-character-sheets/blob/f403571bf3e6b5688b2e80cbc1407839426539eb/5e%20Darker%20Dungeons/5e%20Darker%20Dungeons.html) for legacy-style row/worker conventions. Its rule changes are not used by the importer.

## Required in-game smoke test

Use a test game or a duplicate game with the 2014 legacy sheet. Install the script and check the API console for the ready message. You need the actual Roll20 game and GM access; this repository does not authenticate to your account.

1. Paste `examples/pc-mira.json` into the **Description & Notes** of the private `GPT Import` handout and save. Run `!gpt-check-handout GPT Import`; no character should appear. Run `!gpt-import-handout GPT Import` and open Mira.
2. Confirm PC mode, Wizard 3, Int 16, HP 20/20, AC 12, PB +2, Int save +5, Wis save +3, Arcana +5, and passive Perception 11. The custom class and manual level calculations are intentional.
3. Click Dagger: total attack modifier +4; damage 1d4+2 piercing. Click Fire Bolt: +5 and 1d10 fire. Ensure the chat template renders without unresolved attributes or unmatched brackets. Roll outcomes vary; check the expression/modifier.
4. On Spells, confirm DC 13, spell attack +5, four 1st-level slots and two 2nd-level slots remaining. Open a spell card; verify its text, components and preparation marker. A spell card should not automatically spend slots.
5. Close and reopen the sheet, then restart the Mod sandbox and reopen again. The same imported values should remain. Check the API console for errors. Unexpected recalculation is a compatibility issue to report with sheet name/version, field and actual value.
6. Replace the handout JSON with `examples/npc-ash-road-captain.json`, save, check, then import. Confirm NPC mode, AC 15, HP 45/45, hit dice 7d8+14, CR 2, Dex save +5, Wis save +3, Perception +3 and Stealth +5. Traits, Multiattack and Parry should display.
7. Click Shortsword: +5 and 1d6+3 piercing, whispered to GM. Multiattack should output text rather than automatically perform two attacks. Test its reaction text as well.
8. Repeat the NPC import. Expect a duplicate-name error and exactly one captain. Try a malformed payload; no partial new sheet should remain. As a non-GM player, commands should have no effect.
9. Assign Mira to a test player using the character's Edit dialog. Confirm the player can open and roll the sheet; other imported characters remain private until assigned.

For an NPC spellcaster or legendary creature, additionally check spell-card visibility, supplied spell DC/bonus and slot counters, and the legendary section/count. These paths have local mapping tests; they also need live verification when used.

## Troubleshooting

- **No help message:** game owner needs Roll20 Pro, Mods must be enabled/running, and the complete script must be saved. Inspect the Mod console. Only GM commands receive replies.
- **Wrong sheet or Charactermancer opens:** verify the game uses the actual legacy D&D 5E by Roll20 sheet. This script cannot change the game's sheet selection. Cancel the wizard rather than rebuilding over imported values; report persistent prompts.
- **No handout / found 2:** match the saved handout name exactly and use a unique name. Names after commands are not quoted.
- **Invalid JSON:** paste only the complete JSON object into Description & Notes, save, then check. Avoid smart quotes, trailing commas, prose outside the object, and literal newlines inside a JSON string (use `\n`). Fenced code blocks are accepted, but plain JSON is simpler.
- **Unsupported field:** consult the format guide; there is no arbitrary Roll20 attribute passthrough. Preserve unusual features as plain text and configure mechanics manually.
- **Wrong AC/attack after character changes:** these are imported fixed values. Update custom AC and attack bonuses/damage manually. Inventory is descriptive; equipping an item does not add its mechanics.
- **Empty attack buttons / stale derived fields:** allow workers to finish and close/reopen the sheet. If unresolved, report the exact target sheet/version and Mod console error. Do not reimport under a different name repeatedly to hide the failure.

There is no general undo command. Remove a newly imported test character through Roll20's Journal when you no longer need it. Existing sheets are never updated by this importer. Cleanup handles synchronous object-creation or worker-scheduling errors; an asynchronous hosted worker failure requires manual inspection of the new character.
