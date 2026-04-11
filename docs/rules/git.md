# Git Rules

## Repository Shape

- `D:\BrawlTree` is not a Git repository.
- `frontend/`, `backend/`, `bot/`, and `crawler/` are separate Git repositories.
- Check `git status --short` inside the target module before editing or reporting changed files.
- Keep unrelated user changes intact.

## Commit Message Rules

- When asked to create a commit message for these repositories, output one Korean line only.
- Format is `type : content`.
- The final answer must be the raw commit message text only.
- Do not wrap the commit message in backticks, quotes, a code block, bullets, or any Markdown formatting.
- Do not add a body, bullet list, changelog, explanation, prefix, or suffix.
- Keep the full line within 50 characters when possible.
- Do not use English conventional-commit format such as `docs: ...`.

## Allowed Types

- `feat`: new feature.
- `update`: behavior adjustment.
- `fix`: bug fix.
- `docs`: documentation or comments.
- `design`: UI or visual change.
- `style`: formatting-only change.
- `rename`: file or identifier rename.
- `delete`: removal.
- `refactor`: behavior-preserving structure change.
- `test`: tests.
- `chore`: build, config, import cleanup, or maintenance.

## Correct Output Examples

docs : 크롤러 규칙 및 MySQL 스키마 문서화
fix : 전투 로그 필터 보정
test : 크롤러 파티션 검증 추가

## Incorrect Output Examples

- `docs : 크롤러 규칙 및 MySQL 스키마 문서화`
- "docs : 크롤러 규칙 및 MySQL 스키마 문서화"
- ```text
  docs : 크롤러 규칙 및 MySQL 스키마 문서화
  ```
- Commit message: docs : 크롤러 규칙 및 MySQL 스키마 문서화
