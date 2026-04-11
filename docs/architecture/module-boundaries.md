# Module Boundaries

## Frontend

- Owns route composition, UI state, client-side presentation, i18n usage, and API service usage.
- Call backend APIs through `frontend/src/services` when a service exists.
- Do not embed crawler implementation details in UI components.
- Owns CDN locale/resource loading behavior and client cache safety.
- Uses `VITE_BASE_URL` through `src/common/config/config.ts` for backend API base URL.

## Backend

- Owns API response contracts, DTO validation, controllers, services, repositories, and query behavior.
- Keep controllers thin and move business logic into services.
- Do not duplicate crawler ingestion or worker logic in backend services.
- Coordinate schema assumptions with crawler migrations and entities.
- Reads crawler-managed MySQL tables such as `users`, `user_profile`, `user_battles_normal`, `user_battles_ranked`, `user_brawler_battles`, and `battle_stats`.
- May call crawler operational APIs only through explicit service methods.

## Bot

- Owns Discord.js command handling and bot-facing presentation.
- Keep bot command logic separate from backend API and crawler ingestion logic.
- Do not hard-code Discord tokens, private server IDs, or private channel IDs.
- Use env/config for runtime secrets and deployment-specific values.
- If bot commands depend on backend or crawler contracts, document and validate the API/service contract rather than duplicating backend query logic.

## Crawler

- Owns ingestion, scheduling, workers, migrations, partitions, upstream API normalization, and aggregation upserts.
- Treat `worker-main`, `worker-sub`, and scheduler roles as separate runtime concerns.
- Coordinate schema changes with backend queries before changing table or column meaning.
- Owns TypeORM migrations and seed-style DB initialization under `src/database`.
- Owns Redis-backed worker coordination and distributed lock behavior.

## Cross-Module Contract Rules

- Keep shared terms consistent, including tags, IDs, `matchType`, and `battleTime`.
- When changing API response shape, update backend DTO/service behavior and frontend service/types together.
- When changing DB schema or partition behavior, update crawler migration/entity behavior and backend query expectations together.
- Preserve Brawl Stars public identifiers such as `#TAG` values, brawler IDs, map IDs, and mode names as external contracts.
- When changing bot-facing command data, keep public response text and backend/crawler dependencies aligned.
