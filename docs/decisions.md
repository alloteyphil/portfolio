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
- Design direction is minimal and purple-forward.
- Light animations are included.

## Data and Backend

- Clerk is used for private admin authentication.
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
- Analytics uses PostHog.

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

- Primary purple shade token values.
- Final animation set (which components animate and by how much).
- Access role model details beyond the current baseline.

## Defaults While Pending

- Use a conservative purple palette and keep contrast AAA/AA-friendly where possible.
- Use subtle motion only (short duration, reduced distance, and `prefers-reduced-motion` support).
- Treat authenticated authorized operators as allowed until expanded role definitions are added.

## Change Protocol

When a new decision is made:

1. Update this file first.
2. Mirror changes in `docs/implementation-plan.md` if execution changes.
3. Mirror changes in `docs/integrations.md` if secrets/contracts change.

## Documentation Guardrail

- Decision updates should be atomic: include all dependent doc updates in the same PR.
