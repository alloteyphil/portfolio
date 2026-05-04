# Integrations and Runtime Contract

This file defines provider responsibilities and runtime contracts at a high level.
Detailed environment and credential values are intentionally kept private.

## Use This Document When

- Adding, removing, or changing external provider integrations.
- Reviewing runtime contracts for API routes and background workflows.

## Integration Matrix

| Integration | Purpose | Runtime Surface |
| --- | --- | --- |
| Clerk | Authentication and admin access control | Private admin routes |
| ScreenshotOne | Website screenshot capture | Refresh pipeline |
| Cloudinary | Screenshot storage and CDN delivery | Projects UI and refresh pipeline |
| Resend | Contact form email delivery | Contact endpoint |
| Turnstile | Contact spam/bot protection | Contact form verification |

## Environment and Credentials

- Environment variables are required for each provider above.
- Secret names/values are tracked privately outside public documentation.
- Any env contract changes must stay synchronized with deployment settings and runtime checks.

## Contract Notes

- All secrets must be configured in production and in CI where needed.
- Optional values must have explicit runtime fallback behavior.
- Any env additions must update:
  - `.env.example`
  - `README.md`
  - this file

## Provider-Specific Contracts

## Clerk

- Protects `/admin` routes and mutation endpoints.
- Enforces owner/admin-only curation actions via private owner allowlist configuration.

## ScreenshotOne and Cloudinary

- ScreenshotOne captures desktop-sized image only.
- Cloudinary public ID stays deterministic (`portfolio/<repo-name>`).
- Failed screenshot updates preserve prior Cloudinary URL.
- Admin curation toggles GitHub `portfolio` topic to control visibility on `/projects`.

## Resend and Turnstile

- Contact send requires successful Turnstile verification.
- Resend delivery failures return non-success status and log diagnostic details.

## Operational Expectations

- CI can trigger refresh endpoint when deployment configuration is present.
- Refresh endpoint remains idempotent and safe to retry.
- Contracts should be versioned in docs whenever payloads or behavior change.

## Documentation Guardrail

- Keep this document provider-focused. Do not include raw credential values or private operational secrets.
