# Terminal Portfolio V2

Next.js App Router portfolio with a terminal aesthetic, admin-curated featured projects, and automated screenshot refresh workflows.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Clerk for admin authentication
- Octokit for GitHub repository data
- ScreenshotOne for website capture
- Cloudinary for screenshot hosting/CDN
- Resend + Turnstile for contact submissions
- GitHub Actions for refresh automation

## Local development

- Install dependencies: `bun install`
- Run locally: `bun run dev`
- Build check: `bun run build`

Operational deployment and secret management details are intentionally kept private.

## Current product direction

- `/projects` will show only curated featured repos with valid live URLs.
- Featured repo curation is owner/admin controlled via protected admin surface.
- Blog is deferred from shipped scope for this phase.

## Admin curation

- Route: `/admin` (Clerk-protected + owner email allowlist)
- Uses GitHub repo topics as the visibility source of truth:
  - visible on `/projects` when repo has `portfolio` topic
  - hidden when `portfolio` topic is removed
- Admin can update project visibility and editable metadata (description, tags, and live link).

## Screenshot refresh API

- Admin-triggered refresh captures screenshots and updates project previews.
- Refresh results include processed/succeeded/failed counts and per-project errors when present.

## GitHub Actions

On push to `main`, automation can trigger screenshot refresh.

## Documentation map

- `docs/decisions.md` - finalized and pending decisions
- `docs/implementation-plan.md` - phased execution plan and acceptance criteria
- `docs/integrations.md` - integration responsibilities and runtime boundaries
- `docs/runbook-screenshots.md` - screenshot operations and fallback policy
- `docs/blog-future.md` - deferred blog activation plan
- `docs/testing-checklist.md` - testing and pre-merge checklist
- `docs/bun-workflow.md` - Bun package manager workflow and command map
- `docs/image-optimization.md` - screenshot delivery and rendering optimization guide
