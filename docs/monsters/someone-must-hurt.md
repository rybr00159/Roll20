# Someone Must Hurt: Roll20 imports

Four NPC imports converted from your uploaded **Someone Must Hurt — Level 8 Statblocks (Copyable Markdown).md**, for the legacy **D&D 5E by Roll20** sheet and 2014 rules. Statistics and mechanics follow the supplied homebrew. The source targets **five 8th-level PCs**; these files do not rebalance it for the level 7 PCs elsewhere in this repository.

[Download the complete Roll20 pack](../../assets/someone-must-hurt-roll20.zip). It contains the four JSON files, the existing importer script, the GM reference, and the supplied source text. Extract the ZIP before use.

| Monster | Import JSON | AC | HP | CR / XP |
| --- | --- | --- | --- | --- |
| Suture Attendant | [npc-suture-attendant.json](../../examples/someone-must-hurt/npc-suture-attendant.json) | 15 | 60 | 2 / 450 |
| The Rejected: Many-Handed Crawler | [npc-many-handed-crawler.json](../../examples/someone-must-hurt/npc-many-handed-crawler.json) | 15 | 102 | 5 / 1,800 |
| The Rejected: Spinal Crawler | [npc-spinal-crawler.json](../../examples/someone-must-hurt/npc-spinal-crawler.json) | 16 | 110 | 5 / 1,800 |
| Matron Yselle, the Anatomist of Mercy | [npc-matron-yselle.json](../../examples/someone-must-hurt/npc-matron-yselle.json) | 17 | 170 | 10 / 5,900 |

## Import into your game

Use the repository's existing **ChatGPT Importer** Mod and a Roll20 Pro game using the actual legacy 2014 sheet. No importer update is required. If you have not installed it, paste [ChatGPTImporter.js](../../roll20/ChatGPTImporter.js) into one new Mod script and save it; run `!gpt-help` as GM to check that it is running.

1. Download an individual JSON file using GitHub's **Download raw file** control, or extract it from the ZIP. Copy the JSON object itself.
2. Create a private Roll20 handout named **GPT Import**. Paste one complete monster JSON into **Description & Notes**, then save the handout.
3. Run the check command, then the import command:

```text
!gpt-check-handout GPT Import
!gpt-import-handout GPT Import
```

4. Open the new NPC sheet and let its workers finish. Check the values in the table, one weapon attack, and Yselle's reaction and legendary section.
5. Replace the handout contents with the next JSON, save, and repeat for each of the four monsters. The importer accepts one monster at a time and refuses an existing character name.

The imported NPCs are private and their rolls whisper to the GM. Weapon actions have attack and damage formulas; Multiattack is a reminder card, so click each attack separately. Saving throws, grapple checks, conditions, recharge, limited uses and triggered effects are resolved manually.

## Tokens and encounter objects

All four monsters are **Medium**: use one grid square per creature on a 5-foot grid. Import the Suture Attendant once and place as many attendant tokens as the encounter calls for. Both attendant portraits can represent that same sheet. Both Yselle portraits likewise represent one sheet and **one 170-HP pool**.

For multiple attendants, set each token's **Represents Character** to Suture Attendant, then put **60 current / 60 maximum HP** in an **unlinked** bar. Linking all their HP bars to the one sheet would make damage affect every linked copy. Save configured default tokens through each character's **Edit → Default Token** control. A separate saved token or Roll20 rollable-table token can provide the alternate portrait without creating another stat block. This pack contains stat blocks and reference text; the uploaded Markdown contains no portrait image files.

Use ordinary object markers with unlinked bars for **three conduits** (30 HP each), the **suspended heart** (25 HP, initially invulnerable), and any **Living Suture restraint** (15 HP). These are objects, so the pack does not give them invented creature abilities or CRs. Record their AC, immunities and vulnerability conditions from the [GM reference](someone-must-hurt-gm-reference.md). Set their display sizes to fit your map; the supplied source does not specify object sizes.

## What needs tracking

| Feature | Manual handling |
| --- | --- |
| Attendant's Living Sutures | Once per turn on a needle hit; Medium or smaller; escape DC 14; at most one held creature per attendant |
| Attendant's Death Spasm | At 0 HP: DC 13 Dexterity save, 2d6 piercing on failure, no damage on success, within 5 feet |
| Many-Handed Crawler | Grapple escape DC 15; grapple also restrains; one held creature; bite reach is only 5 feet |
| Spinal Crawler | Claw hit: Medium or smaller target saves Strength DC 15 against prone; apply distance-dependent prone advantage/disadvantage |
| Yselle's Living Suture | Recharge 5–6; DC 16 Dexterity save; 3d6 piercing and up to 1 minute restrained on failure; action Athletics DC 16 or destroy the sutures |
| The Unfolding | Trigger once at 85 HP or less while not incapacitated; DC 16 Wisdom save against fright until the end of each affected creature's next turn |
| Regeneration | **End** of Yselle's turn; +5 HP only while alive and at least one conduit is active |
| Transfer Injury | Reaction, 3/day; reduce damage by 10 to minimum 0; needs an active conduit; Nera's matching wound uses no HP pool |
| Legendary Resistance | 1/day |
| Legendary actions | **2** per turn cycle; refill at start of Yselle's turn; Surgical Step costs 1, Bone Scalpel costs 2; use at the end of another creature's turn |
| Living chamber | Separate initiative count 20, losing ties; alternate lair options; can continue after Yselle falls while a conduit is active |

Yselle has **no Spellcasting trait**. Her features remain monster features even when described as magical; they were not converted into spell cards. Her normal and legendary Bone Scalpel buttons both roll **+8**, **2d8+4 slashing**, and **1d6 necrotic**.

Create a private handout from [the GM reference](someone-must-hurt-gm-reference.md) for the chamber, ritual targets, timers and encounter counts. The original adventure's endings and additional NPC rules were not included in the upload; continue using the original adventure for those details.

## Validation and source

All four files pass the repository's JSON validator and attribute planner. Local checks compare the supplied stat-block numbers with the JSON and verify the action, reaction and legendary mappings, including both Bone Scalpel damage types. This is not a live Roll20 sheet/UI test. Use [the live verification guide](../TESTING.md) after importing.

The [uploaded source](sources/someone-must-hurt-level8-statblocks.md) is retained unchanged. CRs are the source author's homebrew design estimates, not computed or playtested guarantees. The existing importer and schema were not changed.
