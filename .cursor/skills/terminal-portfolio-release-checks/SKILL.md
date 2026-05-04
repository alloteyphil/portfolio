---
name: terminal-portfolio-release-checks
description: Defines a repeatable pre-merge and pre-release validation flow for portfolio reliability. Use when preparing merge-ready changes, release candidates, or quality signoff checks.
---

# Terminal Portfolio Release Checks

## Use This Skill When

- Finishing a feature/fix and preparing to merge.
- Validating release readiness after integration changes.
- Running final checks after data-pipeline or automation changes.

## Build Quality Gate

1. `bun run lint`
2. `bun run typecheck`
3. `bun run build`

## Functional Gate

- `/projects` only shows curated repos with valid live URLs.
- Project cards show screenshot or pending fallback.
- `/api/refresh-screenshots` rejects invalid tokens.
- Screenshot refresh preserves previous image when provider fails.

## Operational Gate

- Required environment variables are documented in `README.md`.
- GitHub Actions refresh workflow still posts to refresh endpoint with expected auth headers.
- Documentation map includes newly added operational docs.

## Exit Criteria

- All three gates pass with no unresolved regressions.
- Behavior-affecting contract changes are documented.
