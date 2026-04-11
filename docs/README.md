# Bot Docs Index

Use these docs for Discord bot work in `bot/`.

## Read by Task Type

- Any bot implementation task: read `rules/project.md`.
- Any docs or workflow task: read `rules/harness-engineering.md` and `rules/documentation.md`.
- Command behavior task: read `rules/testing.md` and `rules/validation.md`.
- Cross-feature data dependency task: read `architecture/workspace.md` and `architecture/module-boundaries.md`.
- Git commit-message task: read `rules/git.md`.

## Local Rules

- Primary bot rule source: `rules/project.md`.
- Keep bot secrets and deployment IDs out of code and docs.
- Keep command handlers focused on Discord interaction flow.
- Do not duplicate backend API or crawler ingestion logic inside the bot.
