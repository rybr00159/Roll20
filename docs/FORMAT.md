# Character JSON v1

Use one JSON object, not an array. All keys are case-sensitive. Unrecognized keys are errors, so misspelled fields cannot silently disappear. The complete schema is [character.schema.json](character.schema.json); examples are in [../examples](../examples).

## Shared fields

| Field | Meaning |
| --- | --- |
| `schema_version` | Required integer `1` |
| `type` | Required `"pc"` or `"npc"` |
| `name` | Required nonblank single-line name, up to 120 characters |
| `abilities` | Required object with all six full lowercase ability names; integer scores 1–30 |
| `hp` | Required `{ "max": 20 }`; optional `current`, `temp`, and dice `formula`. Current defaults to max and cannot exceed it. Temp HP is separate. |
| `ac` | Required `{ "value": 15, "type": "studded leather" }`; `type` is optional NPC armor text. PC AC is fixed custom AC. |
| `speed` | Required text, e.g. `"30 ft., climb 20 ft."` |
| `alignment`, `bio`, `languages` | Optional plain text |
| `proficiency_bonus` | Optional integer override; otherwise inferred from PC level or NPC CR |
| `traits` | Optional array of `{ "name": "...", "description": "...", "source": "Class" }`; source is optional and used for PCs |
| `spellcasting`, `spells` | Optional, described below |

Use numbers for scores, HP, AC, bonuses and level. Do not use `"+5"` when the schema expects a number: use `5`. Do not use Roll20 attribute names or macros. A `description` is plain text, including ordinary dice such as `2d6+3`; it cannot contain `[[...]]`, `@{...}`, `%{...}`, `?{...}`, `&{...}`, `{{...}}`, or command lines beginning with `!` or `/`. These are rejected in every input string. A literal rules reference like `1/day` within prose is fine.

Inputs are limited to 100,000 characters. List limits and text limits appear in the schema. Store one character per handout. Required fields have no invented defaults; omitted optional lists are empty.

## PCs

Also required: `class`, `level` (1–20), and `saving_throws` (array of proficient full lowercase ability names). An empty saves array is valid for a deliberately untrained character, but standard PCs normally have at least two.

Supported `class` values: `Barbarian`, `Bard`, `Cleric`, `Druid`, `Fighter`, `Monk`, `Paladin`, `Ranger`, `Rogue`, `Sorcerer`, `Warlock`, `Wizard`. Use 2014 features and subclass timing. Supply a subclass name only at the level the subclass is gained; the importer stores the label rather than granting features.

Optional: `race`, `subclass`, `background`, integer `xp`, plain-text `proficiencies`, and:

```json
{
  "skills": { "stealth": "expertise", "perception": "proficient" },
  "saving_throws": ["dexterity", "intelligence"],
  "attacks": [
    {
      "name": "Shortbow",
      "to_hit": 5,
      "kind": "Ranged",
      "range": "80/320 ft.",
      "target": "one target",
      "damage": { "dice": "1d6+3", "type": "piercing" },
      "description": "Ammunition; two-handed."
    }
  ],
  "equipment": [
    { "name": "Shortbow", "quantity": 1, "weight": 2, "description": "Optional item notes" }
  ]
}
```

For attacks, `name`, `to_hit`, and `damage` are required. `kind`, `range`, `target`, `description`, and `damage2` are optional. `damage2` has the same shape as `damage`. All damage formulas already include their full ability/magic bonuses. To-hit is the final total. Equipment defaults to quantity 1 and weight 0 per unit; item notes are informational. Inventory and attack rows are separate.

An omitted skill is untrained. Valid skill keys are `acrobatics`, `animal_handling`, `arcana`, `athletics`, `deception`, `history`, `insight`, `intimidation`, `investigation`, `medicine`, `nature`, `perception`, `performance`, `persuasion`, `religion`, `sleight_of_hand`, `stealth`, `survival`. PC skill bonuses are calculated from the normal ability and PB; Jack of All Trades, unusual ability substitutions and other situational bonuses need manual sheet adjustment.

## NPCs

Also required: `size` (e.g. `"Medium"`), `creature_type` (e.g. `"humanoid (human)"`), and string `challenge` (`"0"`, `"1/8"`, `"1/4"`, `"1/2"`, or `"1"`–`"30"`). CR is supplied by the generator, not computed. Optional integer `xp` is literal; XP is not inferred from CR.

Optional text: `senses`, `vulnerabilities`, `resistances`, `immunities`, `condition_immunities`. Include passive Perception in `senses`. NPC saves and skills are **final numeric bonuses**, not proficiency selections:

```json
{
  "saving_throws": { "dexterity": 5, "wisdom": 3 },
  "skills": { "perception": 3, "stealth": 5 },
  "actions": [
    { "name": "Multiattack", "description": "Makes two claw attacks." },
    {
      "name": "Claw",
      "description": "",
      "attack": {
        "to_hit": 5,
        "kind": "Melee",
        "range": "5 ft.",
        "target": "one target",
        "damage": { "dice": "1d6+3", "type": "slashing" }
      }
    }
  ],
  "reactions": [{ "name": "Parry", "description": "Adds 2 AC against one visible melee attack." }],
  "legendary_action_count": 3,
  "legendary_actions": [{ "name": "Move", "description": "Moves up to half its speed." }]
}
```

Action `name` and `description` are required, even when description is empty. An action without an `attack` is a text action, suitable for Multiattack, recharge/save-based abilities, and movement. An action with `attack` requires final `to_hit` and `damage`, with optional `damage2`. Its default kind is `Melee`, range `5 ft.`, and target `one target`; supply these explicitly for ranged attacks. Nested `attack` objects do not have their own name or description.

Reactions are text entries like traits. Legendary actions use the same shape as actions; a nonempty list requires `legendary_action_count`. Include action costs in the name or description; the importer does not track expenditures. `source` on an NPC trait/reaction is accepted as optional metadata but only the name and description are displayed.

## Spells

When `spells` is nonempty, supply `spellcasting`. A PC caster also requires `slots` (use `{}` when it has no spell slots). Supply full ordinary slot totals explicitly; the importer does not derive them from class. NPC slots are optional. Slot counters start full. The legacy field ending in `_slots_expended` is the counter used for **remaining** slots by the OGL companion script.

```json
{
  "spellcasting": {
    "ability": "intelligence",
    "save_dc": 13,
    "attack_bonus": 5,
    "slots": { "1": 4, "2": 2 }
  },
  "spells": [
    {
      "name": "Fire Bolt",
      "level": 0,
      "school": "evocation",
      "casting_time": "1 action",
      "range": "120 ft.",
      "components": "V, S",
      "duration": "Instantaneous",
      "description": "Ranged spell attack, 1d10 fire on a hit."
    }
  ]
}
```

Casting `ability` is required; omitted `save_dc` and `attack_bonus` default to `8 + PB + ability modifier` and `PB + ability modifier` respectively. Slots use keys `"1"`–`"9"` with integer totals; absent levels have zero slots. Warlock pact slots may be represented at their current spell level, but short-rest recovery and Pact Magic rules are manual.

Each spell requires `name`, `level` (0 for cantrip), lowercase `school`, `casting_time`, `range`, `components`, `duration`, and `description`. Schools: `abjuration`, `conjuration`, `divination`, `enchantment`, `evocation`, `illusion`, `necromancy`, `transmutation`. Components should contain only the applicable `V`, `S`, `M` abbreviations. Optional fields: `target`, `materials`, boolean `concentration`, boolean `ritual`, boolean `prepared`, and text `higher_levels`.

Spell cards preserve text only. To get an attack button, also supply a normal attack entry with its final to-hit and damage. Save-based spells and effects are resolved manually.

## Dice syntax

Formula examples: `1d8+3`, `2d6+1d4-2`, or `5`. Supported dice: d4, d6, d8, d10, d12, d20, d100, with up to 999 dice per term. Only addition/subtraction is accepted; no inline rolls, functions, queries, rerolls, keep/drop expressions, or attribute references. Use lowercase `d`.

The JSON Schema expresses structure, bounds, enums and dice syntax. The runtime additionally checks current HP versus max, caster dependencies, legendary-action count, plain-text safety, and single-line names. Use `npm run validate -- file.json` for the authoritative check.
