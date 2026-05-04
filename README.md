# Terminal Portfolio V2

Next.js App Router portfolio with a terminal aesthetic, admin-curated featured projects, and automated screenshot refresh workflows.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Convex for app data and backend functions
- Clerk for admin authentication
- Octokit for GitHub repository data
- ScreenshotOne for website capture
- Cloudinary for screenshot hosting/CDN
- Resend + Turnstile for contact submissions
- PostHog for analytics
- GitHub Actions for refresh automation

## Setup

1. Copy environment template:
   - `cp .env.example .env.local`
2. Fill required values:
   - `GITHUB_TOKEN`
   - `GITHUB_USERNAME`
   - `SCREENSHOTONE_API_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `REFRESH_SCREENSHOTS_SECRET`
   - `VERCEL_DEPLOY_HOOK_URL` (optional)
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_DEPLOYMENT`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`
3. Install dependencies:
   - `bun install`
4. Run locally:
   - `bun run dev`

## Current product direction

- `/projects` will show only curated featured repos with valid live URLs.
- Featured repo curation is owner/admin controlled via protected admin surface.
- Blog is deferred from shipped scope for this phase.

## Screenshot refresh API

- Route: `POST /api/refresh-screenshots`
- Auth: `Authorization: Bearer <REFRESH_SCREENSHOTS_SECRET>` or `x-refresh-token` header
- Behavior:
  - checks featured live repos
  - updates screenshots only for relevant changed repos
  - captures homepage screenshots via ScreenshotOne (desktop profile)
  - uploads to Cloudinary using deterministic public IDs
  - preserves previous screenshot on provider failure or quota limits
  - optionally triggers `VERCEL_DEPLOY_HOOK_URL`

## GitHub Actions

Workflow file: `.github/workflows/refresh-portfolio-screenshots.yml`

Required repository secrets:

- `SCREENSHOT_REFRESH_URL` (example: `https://yourdomain.com/api/refresh-screenshots`)
- `REFRESH_SCREENSHOTS_SECRET`

On push to `main`, the workflow triggers screenshot refresh via curl.

## Documentation map

- `docs/decisions.md` - finalized and pending decisions
- `docs/implementation-plan.md` - phased execution plan and acceptance criteria
- `docs/integrations.md` - integration contracts and env variables
- `docs/runbook-screenshots.md` - screenshot operations and fallback policy
- `docs/blog-future.md` - deferred blog activation plan
- `docs/testing-checklist.md` - testing and pre-merge checklist
- `docs/bun-workflow.md` - Bun package manager workflow and command map
- `docs/image-optimization.md` - screenshot delivery and rendering optimization guide
