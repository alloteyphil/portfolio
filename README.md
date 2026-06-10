# Terminal Portfolio V2

Next.js App Router portfolio with a terminal aesthetic, curated projects, and automated screenshot previews.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
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

- `/projects` will show only curated featured repos with valid live URLs, merged with manual entries (private repos or non-GitHub work).
- Blog is deferred from shipped scope for this phase.

## Project sources and ordering

Projects on `/projects` come from two sources, merged at request time:

1. **GitHub repos** tagged with the `portfolio` topic. Private repos are included; their public source link is replaced with a disabled `private` button on the card.
2. **Manual projects** stored in `data/portfolio-config.json` (also editable from `/admin`). Use these for client work that doesn't live in your GitHub account or for projects that need a custom display name.

Display order is controlled from `/admin` (`Project order` section). The order is persisted to `data/portfolio-config.json` via the GitHub Contents API; updates take effect on the next request — no redeploy required.

### GitHub token expiry fallback

`data/portfolio-config.json` also stores a `cachedGithubRepos` snapshot and a `cachedAt` timestamp. On each request, the app tries a live GitHub API call first. If the call fails (expired token, missing env var, rate limit), `/projects` renders from the cached snapshot instead of showing an empty list. When the token is valid again, the snapshot refreshes automatically in the background (at most once per hour). See `docs/integrations.md` for full details.

Optional environment variables:

- `PORTFOLIO_CONFIG_REPO`: `owner/repo` slug that holds `data/portfolio-config.json`. Defaults to `${GITHUB_USERNAME}/portfolio`.
- `PORTFOLIO_CONFIG_REPO_NAME`: alternative name override when only `GITHUB_USERNAME` is set (defaults to `portfolio`).

## Resume (PDF)

The nav link opens `/resume.pdf` in a new tab. Keep your PDF at `public/resume.pdf` (same filename as the URL). If that file is missing, the link 404s until you add it.

## Turnstile (contact form)

The contact form loads Turnstile with **explicit** `render` / `remove` so leaving `/contact` does not leave orphaned widgets (avoids “Cannot find Widget … use turnstile.remove()”).

In **`next dev`**, the app uses Cloudflare’s [dummy site + secret keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) from `lib/turnstile-keys.ts` so Turnstile works on **localhost** without hostname allowlisting (avoids client error **110200**). Production builds use environment variables.

To exercise your **real** Turnstile keys while developing, set `NEXT_PUBLIC_TURNSTILE_USE_PRODUCTION_KEYS=true` and add your dev hosts under the widget’s **Hostname Management** in the Cloudflare dashboard (otherwise **110200** returns).

## Cloudinary usage vs refresh

- **Refresh (upload path):** each successful capture uploads to Cloudinary and drives transformation and storage toward your plan. Run refresh **sparingly**; featured projects use deterministic public IDs so repeat uploads update in place rather than multiplying assets.
- **Delivery (page views):** project cards load screenshots via Cloudinary URLs (see `docs/image-optimization.md` for `f_auto`, `q_auto`, and sizing). That is **bandwidth / on-the-fly transform** usage when users view the site, separate from the refresh job.
- **Guarding cost:** expensive refresh operations are restricted and should be triggered intentionally.

## GitHub Actions

Screenshot refresh runs from a manual workflow trigger (not on every push).

## Documentation map

- `docs/decisions.md` - finalized and pending decisions
- `docs/implementation-plan.md` - phased execution plan and acceptance criteria
- `docs/integrations.md` - integration responsibilities and runtime boundaries
- `docs/runbook-screenshots.md` - screenshot operations and fallback policy
- `docs/blog-future.md` - deferred blog activation plan
- `docs/testing-checklist.md` - testing and pre-merge checklist
- `docs/bun-workflow.md` - Bun package manager workflow and command map
- `docs/image-optimization.md` - screenshot delivery and rendering optimization guide
