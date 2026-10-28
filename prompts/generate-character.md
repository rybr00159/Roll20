# Generate a Roll20 import

Use this prompt with Codex in this repository. Outside Codex, attach or paste `docs/FORMAT.md` and a matching example JSON along with this prompt.

> Create the PC or NPC described below using **D&D fifth edition 2014 rules** for the legacy **D&D 5E by Roll20** sheet. Follow this repository's `docs/FORMAT.md` and `docs/character.schema.json` exactly; use the matching example as a shape reference. Do not use 2024 rules or invent unsupported JSON fields.
>
> Output one complete JSON object with `schema_version: 1` and type `pc` or `npc`. PC class names are capitalized. Use full lowercase ability names and the documented lowercase skill keys. All six scores, HP, AC, speed, and the type-specific required fields must be present. A PC needs explicit proficient saving throws. A PC caster needs explicit slot totals.
>
> Give final numeric to-hit bonuses and complete damage formulas including modifiers. PC skills use `proficient` or `expertise`; NPC skills and saves use final numeric bonuses. Preserve special rules in plain-text traits/actions. Include prepared/known spells as spell cards; add attack spells separately as attacks/actions if useful. Descriptions must not contain Roll20 macros or inline rolls. Do not automate feats, resource use, spell effects, or multiclassing.
>
> Check derived statistics against the selected 2014 class, level, ability scores and equipment. For PCs, account for racial ability increases only once and use 2014 subclass timing. Explain material homebrew choices or uncertain rules separately from the JSON. For an original NPC, mark its CR as an estimate in its bio. Use original prose or concise play reminders instead of copying entire sourcebook entries.
>
> In Codex: save the result to a descriptive file under `examples/`, run `npm run validate -- <file>`, correct validation errors, and give me the JSON file plus the two handout commands. Do not change the schema to accommodate invalid output. Outside Codex: output JSON in one code block for pasting into a saved handout and mention that it still needs validation in Roll20.
>
> Character request: [describe the character, level or CR, concept, permitted books, and any house rules here].
