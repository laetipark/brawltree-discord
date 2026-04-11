# Validation Rules

Run the narrowest useful validation for the files touched. If a command cannot run, report what was not validated and why.

## Frontend

- Preferred production check: `npm run build` in `frontend/`.
- Dev server when needed: `npm run dev` in `frontend/`.
- Tests when relevant: `npm run test` in `frontend/`.

## Backend

- Preferred production check: `npm run build` in `backend/`.
- Tests when relevant: `npm run test` in `backend/`.
- Dev server when needed: `npm run start:dev` in `backend/`.

## Crawler

- Preferred production check: `npm run build` in `crawler/`.
- Tests when relevant: `npm run test` in `crawler/`.
- Migrations only when intentionally validating DB changes: `npm run migration:run` in `crawler/`.
- Worker startup checks only when the task changes worker runtime behavior.

## Documentation-Only Changes

- For docs-only changes, confirm file presence and readable Markdown with `rg --files` and `Get-Content`.
- Do not run builds for docs-only changes unless the docs change generated artifacts or scripts.

## Minimum Scenario Guidance

- API changes: verify the backend controller/service path and the matching frontend service type.
- Query or entity changes: verify the TypeORM entity, migration/schema source, and the consuming service.
- Worker changes: verify role-specific behavior for `worker-main`, `worker-sub`, or scheduler rather than starting every runtime by default.
- Cache changes: verify key shape, TTL, stale data tolerance, and bounded growth.
