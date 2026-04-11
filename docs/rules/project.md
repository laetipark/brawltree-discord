# Bot Project Rules

Use this document as the bot-specific development rule source.

## Ownership

- Owns Discord.js slash-command registration and command execution flow.
- Owns bot-facing presentation such as embeds, command descriptions, guide text, and attachment references.
- May call backend or external Brawl Stars-related APIs through service modules.
- Does not own backend query logic, crawler ingestion, or database schema.

## Source Layout

- `src/index.ts`: bot startup entry.
- `src/loaders/client.ts`: Discord client creation, command registration, interaction dispatch, and login handling.
- `src/commands`: slash-command definitions and command execution objects.
- `src/services`: API wrapper services used by commands.
- `src/config`: expected path alias for runtime config; keep secrets in env-backed config and do not commit local secrets.

## Development Rules

- Keep command files focused on Discord interaction flow: parse options, call a service/helper, render a response.
- Put repeated HTTP/API logic in `src/services` instead of command files.
- Keep embed construction deterministic and easy to scan; avoid embedding backend query logic in embeds.
- Keep command registration in `src/commands/index.ts` aligned with command files.
- If a command is disabled, leave an explicit comment explaining whether it is temporary or intentionally unavailable.
- Use path aliases from `tsconfig.json` (`~/commands`, `~/services`, `~/loaders`, `~/config`) consistently.
- Treat `src/config` as runtime configuration even if the concrete config file is local or gitignored.
- Never commit Discord tokens, application/client IDs, private guild IDs, private channel IDs, or deployment-only URLs.

## API Contract Rules

- Keep backend-dependent response assumptions documented in service types or docs.
- If backend response shape changes, update bot service handling in the same scope.
- Prefer service-level normalization before command rendering.
- Do not make live upstream calls from tests; use fixed fixtures or mocked service responses.

## Validation

- Default production check: `npm run build`.
- Dev run when needed: `npm run start:dev`.
- Do not treat `npm test` as a success check while it intentionally exits with an error placeholder.
- For docs-only changes, readable Markdown and file placement checks are enough.
