# Working on this repository

This is a dependency-free Roll20 Mod for the legacy D&D 5E by Roll20 sheet and 2014 rules. Do not migrate examples to 2024 rules.

- Use this existing checkout. Cloud tasks already run in an isolated environment; do not create a Git worktree unless the user explicitly requests one.
- The canonical pasteable script is `roll20/ChatGPTImporter.js`; it must run without Node globals or external dependencies in Roll20. It also exports functions for Node tests.
- Node 20+ is sufficient. No install, services, keys, or build is needed. Run `npm test` and `npm run validate -- examples/pc-mira.json examples/npc-ash-road-captain.json` after code changes.
- After changing schema definitions, run `npm run schema` and commit the generated JSON schema together with relevant docs and tests.
- For character generation, read `prompts/generate-character.md` and `docs/FORMAT.md`, save the requested JSON, and validate it with `npm run validate -- <path>`. Do not change the schema just to make a payload pass.
- Do not claim live Roll20 validation from local tests. The hosted sheet workers/UI require manual checks described in `docs/TESTING.md`.
- Keep imports GM-only and non-overwriting. Validate everything before creating objects. Do not add network calls, secrets, `eval`, or arbitrary attribute passthrough.
