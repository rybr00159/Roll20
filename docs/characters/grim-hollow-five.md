# Five level-7 Grim Hollow characters

Five additional PCs under 2014 5e rules. All use the standard array, a PHB background with no feat, a non-half house-rule starting feat, one Rare item, one Uncommon item, normal starting equipment and the additional 638 gp. All five take a full subclass from the exact **Grim Hollow: Player Pack**, rather than relying only on a minor item to meet the requirement.

| Character | Level-7 class / Grim Hollow subclass | Role | House feat — no stat increase | HP / AC | Remaining gp |
| --- | --- | --- | --- | --- | ---: |
| [Mara Ironwake](mara-ironwake-level7.md) | Fighter: Blade Breaker | Flying polearm striker and stun controller | Great Weapon Master | 60 / 18 | 262 |
| [Torren Ravenmantle](torren-ravenmantle-level7.md) | Barbarian: Path of the Carrion Raven | Raging heavy-weapon attacker and beast summoner | Great Weapon Master | 82 / 17 | 377 |
| [Isolde Mournsong](isolde-mournsong-level7.md) | Bard: College of Requiems | Charm-based controller, party face and necromantic support | War Caster | 66 / 14 | 368 |
| [Sera Dawnwarden](sera-dawnwarden-level7.md) | Paladin: Oath of Zeal | Shield-bearing protector and marked-target smite striker | Polearm Master | 67 / 19 | 158 |
| [Neris Vale](neris-vale-level7.md) | Rogue: Misfortune Bringer | Accurate ranged rogue, scout, face and enemy-save disruptor | Crossbow Expert | 45 / 18 | 407 |

## What is included

Each linked guide gives the array assignment, every racial/feat/ASI increase, native versus item-set scores, feat provenance, skill/tool choices, features and recovery limits, attack totals, magic-item allocations, full shopping ledger, tactics, spell selection where applicable, and Roll20 follow-up settings. Each also links a separate validated JSON import.

The explicit distinction between the two level-1 feat sources matters: Mara, Isolde and Neris take Slasher, Fey Touched and Piercer respectively from **Custom Lineage**. Those racial feats may increase a score; their separate **house-rule feats do not**. Torren and Sera do not receive racial feats. None receives a background feat.

There are no multiclass builds in this batch: keeping class level 7 retains the relevant subclass feature or spell progression and fits the current importer. Stat-setting belts/amulet are part of the stated magic-item allocations; base scores and removal effects are documented. No summon, undead servant, pre-cast buff, or sold starting equipment is assumed for free.

## Imports

With the importer installed, paste one complete character JSON into Description & Notes of a private handout named **GPT Import**, save, then run:

```text
!gpt-check-handout GPT Import
!gpt-import-handout GPT Import
```

Repeat with the next file. Each PC has a unique character name. Existing same-name characters are refused.

- [Mara Ironwake import](../../examples/pc-mara-ironwake-level7.json)
- [Torren Ravenmantle import](../../examples/pc-torren-ravenmantle-level7.json)
- [Isolde Mournsong import](../../examples/pc-isolde-mournsong-level7.json)
- [Sera Dawnwarden import](../../examples/pc-sera-dawnwarden-level7.json)
- [Neris Vale import](../../examples/pc-neris-vale-level7.json)

Follow the guide's manual settings: gold counters for all five; Jack of All Trades for Isolde; conscious Aura of Protection for Sera; cloak saving-throw modifier for Neris. Stances, rage, concentration, resources, conditional criticals, advantage and optional damage remain manual. Current AC, equipped ability scores and ordinary attack totals are already included.

Optional [Giant Ape](../../examples/companions/npc-giant-ape-torren.json) and [Skeleton](../../examples/companions/npc-skeleton-isolde.json) reference imports support Torren's and Isolde's features when actually used. They do not add free starting creatures.

## Validation and sources

All five payloads and both reference templates were validated locally. A separate rules audit checks standard-array arithmetic, feat origins, background versions, item rarities and attunement, HP, primary attacks, spell counts, resource limits and shopping totals. [Audit manifest](grim-hollow-five-audit.json) records the arithmetic and selected sources; this is not a claim of live Roll20 testing.

- [User-specified Grim Hollow: Player Pack](https://5e.tools/book.html#grimhollowplayerpack,1), source ID `GrimHollowPlayerPack`, checked against [this pinned public source revision](https://github.com/TheGiddyLimit/homebrew/blob/069a70e491d5c4df83f6e94e8f48abb75cc0d49b/collection/Ghostfire%20Gaming%3B%20Grim%20Hollow%20-%20Player%20Pack.json). The pack contains six subclasses; this batch uses five.
- Original PHB/DMG class, feat, equipment and item rules, with explicitly identified Tasha and Strixhaven options. Revised XPHB/XDMG data and newer Grim Hollow subclass versions were excluded.

The original Rowan file remains unchanged; these restrictions apply to the five new PCs.
