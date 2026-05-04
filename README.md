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

## Resume (PDF)

The nav link opens `/resume.pdf` in a new tab. Keep your PDF at `public/resume.pdf` (same filename as the URL). If that file is missing, the link 404s until you add it.

## Turnstile (contact form)

The contact form loads Turnstile with **explicit** `render` / `remove` so leaving `/contact` does not leave orphaned widgets (avoids “Cannot find Widget … use turnstile.remove()”).

In **`next dev`**, the app uses Cloudflare’s [dummy site + secret keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) from `lib/turnstile-keys.ts` so Turnstile works on **localhost** without hostname allowlisting (avoids client error **110200**). Production builds use `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` from the environment.

To exercise your **real** Turnstile keys while developing, set `NEXT_PUBLIC_TURNSTILE_USE_PRODUCTION_KEYS=true` and add your dev hosts under the widget’s **Hostname Management** in the Cloudflare dashboard (otherwise **110200** returns).

## Cloudinary usage vs refresh

- **Refresh (upload path):** each successful capture uploads to Cloudinary and drives transformation and storage toward your plan. Run refresh **sparingly**; featured projects use deterministic public IDs so repeat uploads update in place rather than multiplying assets.
- **Delivery (page views):** project cards load screenshots via Cloudinary URLs (see `docs/image-optimization.md` for `f_auto`, `q_auto`, and sizing). That is **bandwidth / on-the-fly transform** usage when users view the site, separate from the refresh job.
- **Guarding cost:** expensive work is already limited by **secret bearer token** (and Clerk on admin routes). This app does not “rate limit Cloudinary” at the CDN; it limits who can **trigger** refresh. Optional hardening: add **Vercel KV** and a per-IP sliding window on `app/api/refresh-screenshots/route.ts` only if you want that extra layer—otherwise skip to avoid new infra.

## GitHub Actions

Screenshot refresh runs from the **Refresh Portfolio Screenshots** workflow via **manual** `workflow_dispatch` (not on every push). Configure `REFRESH_URL` / refresh secret per `docs/runbook-screenshots.md` and the workflow file.

## Documentation map

- `docs/decisions.md` - finalized and pending decisions
- `docs/implementation-plan.md` - phased execution plan and acceptance criteria
- `docs/integrations.md` - integration responsibilities and runtime boundaries
- `docs/runbook-screenshots.md` - screenshot operations and fallback policy
- `docs/blog-future.md` - deferred blog activation plan
- `docs/testing-checklist.md` - testing and pre-merge checklist
- `docs/bun-workflow.md` - Bun package manager workflow and command map
- `docs/image-optimization.md` - screenshot delivery and rendering optimization guide
