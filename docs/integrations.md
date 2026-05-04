# Integrations and Environment Contract

This file defines provider responsibilities, required secrets, and runtime contracts.

## Use This Document When

- Adding, removing, or changing external provider integrations.
- Updating required environment variables.
- Reviewing runtime contracts for API routes and background workflows.

## Integration Matrix

| Integration | Purpose | Runtime Surface |
| --- | --- | --- |
| Convex | App database and server functions | Admin curation, featured project state, screenshot metadata |
| Clerk | Authentication and admin access control | Private admin routes |
| ScreenshotOne | Website screenshot capture | Refresh pipeline |
| Cloudinary | Screenshot storage and CDN delivery | Projects UI and refresh pipeline |
| Resend | Contact form email delivery | Contact endpoint |
| Turnstile | Contact spam/bot protection | Contact form verification |
| PostHog | Product analytics | Page views and key events |

## Required Environment Variables

## Core app

- `NEXT_PUBLIC_SITE_URL`

## GitHub source

- `GITHUB_TOKEN`
- `GITHUB_USERNAME`

## Screenshot pipeline

- `SCREENSHOTONE_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `REFRESH_SCREENSHOTS_SECRET`
- `VERCEL_DEPLOY_HOOK_URL` (optional)

## Convex

- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOYMENT`

## Clerk

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Resend + contact

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

## Turnstile

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

## PostHog

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

## Contract Notes

- All secrets must be configured in production and in CI where needed.
- Optional values must have explicit runtime fallback behavior.
- Any env additions must update:
  - `.env.example`
  - `README.md`
  - this file

## Provider-Specific Contracts

## Convex

- Stores featured projects and screenshot refresh metadata.
- Exposes queries/mutations/actions for admin and refresh pipelines.
- Canonical source for curated project visibility.

## Clerk

- Protects `/admin` routes and mutation endpoints.
- Enforces owner/admin-only curation actions.

## ScreenshotOne and Cloudinary

- ScreenshotOne captures desktop-sized image only.
- Cloudinary public ID stays deterministic (`portfolio/<repo-name>`).
- Failed screenshot updates preserve prior Cloudinary URL.

## Resend and Turnstile

- Contact send requires successful Turnstile verification.
- Resend delivery failures return non-success status and log diagnostic details.

## PostHog

Minimum required events:

- `page_view`
- `project_click_live_link`
- `contact_submit_success`
- `contact_submit_failure`

## Operational Expectations

- CI job triggers refresh endpoint with `REFRESH_SCREENSHOTS_SECRET`.
- Refresh endpoint remains idempotent and safe to retry.
- Contracts should be versioned in docs whenever payloads or behavior change.

## Documentation Guardrail

- Any env or contract change must update `.env.example`, `README.md`, and this file in the same PR.
