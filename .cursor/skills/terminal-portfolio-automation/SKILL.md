---
name: terminal-portfolio-automation
description: Maintains screenshot refresh automation and deploy-trigger reliability. Use when editing GitHub Actions workflow behavior, refresh endpoint contracts, CI secrets, or retry/failure handling.
---

# Terminal Portfolio Automation

## Use This Skill When

- Editing `.github/workflows/refresh-portfolio-screenshots.yml`.
- Changing refresh route auth/header contracts.
- Updating CI secret usage and failure behavior.

## Do Not Use This Skill When

- Changing screenshot capture logic inside app runtime code only.
- Refactoring UI rendering or component composition.

## Scope

- Workflow trigger: push to `main`
- Action: authenticated `POST` to `/api/refresh-screenshots`
- Contract dependency: route auth must match workflow request headers

## Required Secrets

- `SCREENSHOT_REFRESH_URL` -> deployed `/api/refresh-screenshots`
- `REFRESH_SCREENSHOTS_SECRET` -> same value used by app runtime

## Workflow

1. Confirm route request/response contract before changing workflow logic.
2. Keep retry-safe, idempotent behavior for repeated workflow execution.
3. Validate YAML and shell quoting changes.
4. Update `README.md` and docs when secret/contract behavior changes.

## Guardrails

- Fail fast when required secrets are missing.
- Never log auth tokens.
- Keep backward compatibility for route auth headers where practical.
- Ensure failure output stays diagnosable (processed/skipped/failed style summaries).

## Verification

- Validate workflow syntax.
- Confirm auth-protected refresh call still succeeds in deployed environment.
