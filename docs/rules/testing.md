# Testing Rules

## Priorities

- Prefer tests around durable rules: API response shape, query filters, partition behavior, worker role split, retry/rate-limit behavior, and cache key/TTL behavior.
- For frontend changes, prioritize service type compatibility and user-facing route behavior.
- For backend changes, prioritize service-level tests for query and response shaping when controller behavior is thin.
- For crawler changes, prioritize service-level tests around ingestion normalization, upserts, worker selection, and partition maintenance.

## Minimum Scenarios

- API response changes must cover the matching backend route and frontend service type.
- Battle stats/logs changes must cover `type`, `mode`, season window, and stack/pagination behavior.
- Cache changes must cover cache hit, expiry, key parameters, and bounded cleanup.
- Partition changes must cover partition name calculation and `INFORMATION_SCHEMA.PARTITIONS` lookup behavior.
- Worker retry changes must cover 404 handling, retryable errors, rate-limit delay, and max retry boundaries.
- Redis lock changes must cover missing Redis fallback and successful acquire/release behavior.

## Test Style

- Each test should make one rule obvious.
- Prefer fixed fixtures over live upstream Brawl Stars API calls.
- Avoid tests that depend on local private env values.
- If a test cannot run locally because infrastructure is missing, document the missing dependency in the final report.
