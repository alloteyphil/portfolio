# Portfolio V2 Decisions Log

This file is the source of truth for product and technical decisions agreed so far.

## Use This Document When

- Confirming whether a behavior is an approved decision or still pending.
- Reviewing scope boundaries before implementing features.
- Updating downstream docs that depend on finalized decisions.

## Finalized Decisions

## Product

- Portfolio shows only live/deployed projects.
- `/blog` is not shipped in this phase.
- Contact form is included in this phase.
- Resume/CV is accessible from primary navigation and homepage hero CTA.
- Resume file is served as a static public asset (`/cv/resume.pdf`) for direct open/download.
- Near-term portfolio enhancements are prioritized as:
  - project case-study pages
  - skills proof matrix tied to shipped work
  - project filtering and search on `/projects`
- A dedicated skills section is part of portfolio scope and must link each listed skill to concrete project evidence.
- Design direction is "live document" (2026-11-14, replaces the violet editorial pass): the site behaves like a shared doc. The homepage headline is edited live by a flagged caret, the visitor's pointer gets a "You" flag, and a marigold selection highlight is the one recurring gesture (heading reveals, active nav, hover).
- Type: Archivo only, using its width axis. Expanded + heavy for display (`.display`), normal width for body. No serif, no mono labels (mono is for `kbd`/`code` only).
- Palette tokens live in `app/globals.css`: purple-led by owner preference (2026-11-14). Deep purple ink (`rgb(46 16 101)`) on pale lilac, vivid purple `brand` (`rgb(109 40 217)`) for the homepage closing block and focus, marigold accent (`rgb(255 196 37)`) used as selection colour; dark mode is deep aubergine. Green stays reserved for live/presence signals.
- Motion: hero live edit, selection-sweep heading reveals, scroll-linked growth bar and counter, hover highlights. All of it is gated on `html.motion-ok` (set in `lib/theme-init-script.ts`), so no-JS and reduced-motion visitors get the finished page.
- The public site is projects-first: no employment timeline, and no Clubz or WordPress work (owner decision, 2026-11-14). The current job (junior analyst, Points Africa) appears as one line of context only.
- `public/resume.pdf` is out of date as of 2026-11-14 (still lists Clubz); the owner is updating it. Keep `data/featured.ts` and `data/skills.ts` in step with the new version.

## Data and Backend

- No authentication and no admin UI (Clerk and `/admin` removed 2026-11-14). Projects are curated by the `portfolio` GitHub topic plus `data/portfolio-config.json`, edited by commit.
- Internal curation controls which repos are featured on the portfolio.
- Featured projects are curated in app data, not only by GitHub topic.

## Screenshots

- Screenshot source is ScreenshotOne.
- Storage and delivery is Cloudinary.
- Refresh runs only when relevant featured repo data changes.
- If screenshot capture fails or quota is exceeded, keep the previous image.
- Screenshot format for this phase is desktop only.

## Communications and Tracking

- Contact form delivery uses Resend.
- Contact form bot protection uses Cloudflare Turnstile.
- Analytics uses Vercel Web Analytics only. PostHog was dropped by the owner; do not reintroduce it or mention it in public copy.
- The homepage's Dilli Dilli visitor numbers come from the Vercel Web Analytics API (`lib/dilli-stats.ts`), refreshed daily, with the April 2026 figure as fallback and floor.

## SEO

- Basic SEO is in scope:
  - page metadata
  - `sitemap.xml`
  - `robots.txt`
  - Open Graph defaults

## Quality and Delivery

- Tests are required in this phase.
- Pre-merge checklist is required in this phase.

## Pending Decisions

- Final animation set (which components animate and by how much).
- None about access roles: there is no login any more.

## Defaults While Pending

- Keep contrast AAA/AA-friendly where possible; text sitting on marigold always uses `accent-ink`.
- Every animation must have a static final state and respect `prefers-reduced-motion`.

## Change Protocol

When a new decision is made:

1. Update this file first.
2. Mirror changes in `docs/implementation-plan.md` if execution changes.
3. Mirror changes in `docs/integrations.md` if secrets/contracts change.

## Documentation Guardrail

- Decision updates should be atomic: include all dependent doc updates in the same PR.
