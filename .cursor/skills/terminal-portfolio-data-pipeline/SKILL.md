---
name: terminal-portfolio-data-pipeline
description: Owns the portfolio project ingestion and screenshot refresh pipeline from GitHub through Cloudinary rendering. Use when modifying repo filtering, screenshot generation/storage, refresh API behavior, or related environment contracts.
---

# Terminal Portfolio Data Pipeline

## Use This Skill When

- Updating project ingestion from GitHub.
- Modifying screenshot refresh pipeline behavior.
- Changing Cloudinary storage/delivery behavior for project cards.

## Do Not Use This Skill When

- Editing CI workflow plumbing only (use automation skill).
- Updating route shell/layout only (use architecture skill).

## Data Flow

1. `lib/github.ts` fetches repositories via Octokit.
2. `lib/projects.ts` filters/normalizes candidate portfolio projects.
3. `lib/screenshot-store.ts` builds deterministic Cloudinary public IDs and delivery URLs.
4. `lib/cloudinary.ts` reads/uploads screenshot assets.
5. `app/api/refresh-screenshots/route.ts` orchestrates refresh behavior.
6. `app/projects/page.tsx` and `components/project-card.tsx` render screenshot URLs.

## Contract Surface

- Core source: `GITHUB_TOKEN`, `GITHUB_USERNAME`
- Refresh auth: `REFRESH_SCREENSHOTS_SECRET`
- Capture provider: `SCREENSHOTONE_API_KEY`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Optional deploy trigger: `VERCEL_DEPLOY_HOOK_URL`

## Guardrails

- Keep topic filtering explicit and intentional.
- Skip invalid homepage URLs instead of failing page render.
- Keep public ID deterministic: `portfolio/<repo-name>`.
- Preserve prior screenshot behavior on provider failures.
- Keep refresh endpoint secret-protected.

## Workflow

1. If data shape changes, update `types/project.ts` first.
2. Keep provider and transform logic in `lib/*`.
3. Keep routes/components thin and focused on orchestration/rendering.
4. Update docs/env contract whenever variables or behavior change.

## Verification

- Run `bun run lint` and `bun run build`.
- Confirm `/projects` renders with and without screenshot URLs.
- Confirm refresh route behavior remains retry-safe and non-destructive.
