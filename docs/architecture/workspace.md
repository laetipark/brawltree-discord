# Workspace Rules

## Shape

- `frontend/` renders the user-facing client and consumes backend APIs.
- `backend/` owns public API contracts, request validation, service logic, and read queries.
- `bot/` owns Discord.js bot commands, guide responses, and Brawl Stars bot integrations.
- `crawler/` owns upstream data ingestion, worker scheduling, schema maintenance, and analytical table updates.

## Data Flow

1. `crawler/` collects and normalizes upstream Brawl Stars data.
2. `crawler/` writes MySQL tables, including partitioned battle tables.
3. `backend/` reads processed data and exposes API endpoints.
4. `frontend/` calls backend service APIs and renders pages.
5. `bot/` may call external APIs or project endpoints for Discord-facing commands when a feature explicitly uses them.

## Global Rules

- Keep API and schema changes backward compatible when practical.
- Coordinate cross-module changes in one task scope when contracts change.
- Preserve existing environment variable names unless a migration path is explicit.
- Prefer existing local patterns over new abstractions.
- Keep generated or cached artifacts (`dist`, `node_modules`, logs, local env files) out of rule changes.
- Do not include secrets, tokens, private hosts, or private IPs in docs or code.

## Development Rules

- Treat `frontend`, `backend`, `bot`, and `crawler` as separate Git repositories.
- Before changing a module, check that module's `git status --short` and keep unrelated user changes intact.
- Do not create shared code between modules unless the task explicitly introduces a shared package.
- If a backend response changes, update the corresponding frontend service type in the same task.
- If crawler table shape or partition behavior changes, update backend entity/query assumptions in the same task.

## Feature Routing

- Root route: `AGENTS.md` -> `.aiassistant/README.md`.
- Backend route: `backend/AGENTS.md` -> `backend/docs/README.md`.
- Bot route: `bot/AGENTS.md` -> `bot/docs/README.md`.
- Crawler route: `crawler/AGENTS.md` -> `crawler/docs/README.md`.
- Frontend route, when explicitly targeted: `frontend/AGENTS.md` -> `frontend/docs/README.md`.
