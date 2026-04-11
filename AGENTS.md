# Bot Codex Rules

Use this file for Codex work inside `bot/`.

## Read Order

1. If available, read `../AGENTS.md` for workspace-level routing.
2. Read `../.aiassistant/README.md`.
3. Read this file.
4. Read `docs/README.md`.
5. Read `docs/rules/project.md` for bot-specific project and development rules.
6. Read only the other detailed docs needed for the task.

## Scope

- Stack: Node.js, TypeScript, Discord.js 14.
- Primary source root: `src/`.
- Bot owns Discord command handling, bot-facing guide responses, and Brawl Stars bot integrations.
- Bot-specific detailed rules live in `docs/rules/project.md`.

## Implementation Rules

- Keep Discord tokens, server IDs, channel IDs, and deployment-only values in env/config, not code or docs.
- Keep command handlers focused; move reusable API or formatting logic into helpers/services when patterns repeat.
- Avoid duplicating backend query logic or crawler ingestion logic in bot code.
- If a bot command depends on backend/crawler data shape, document the dependency and keep the call boundary explicit.
- Preserve existing TypeScript path and runtime conventions.

## Validation

- Production check: `npm run build`.
- Dev run when needed: `npm run start:dev`.
- `npm test` currently exits with an error placeholder, so do not use it as a success check until the script is replaced.
- For docs-only changes, file presence and readable Markdown checks are enough.
