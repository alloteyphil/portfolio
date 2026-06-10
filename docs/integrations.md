# Integrations and Runtime Contract

This file defines provider responsibilities and runtime contracts at a high level.
Detailed environment and credential values are intentionally kept private.

## Use This Document When

- Adding, removing, or changing external provider integrations.
- Reviewing runtime contracts for API routes and background workflows.

## Integration Matrix

| Integration | Purpose | Runtime Surface |
| --- | --- | --- |
| Clerk | Authentication and protected access control | Internal management surfaces |
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

- Protects internal management routes and mutation endpoints.
- Enforces restricted curation actions via private access control configuration.

## GitHub Repo Cache Fallback

`data/portfolio-config.json` (stored in the portfolio repo via GitHub Contents API) includes two fields that act as a persistent snapshot of the last successful GitHub repo fetch:

- `cachedGithubRepos` — array of normalized repo entries (name, homepage, topics, language, etc.)
- `cachedAt` — ISO timestamp of when the snapshot was last written

**Behaviour:**
- On each `/projects` page load, `lib/github.ts` attempts a live `GET /user/repos` call.
- If the call **succeeds**, the result is used to render projects. If the snapshot is older than 1 hour, it is updated in the background (fire-and-forget, non-blocking).
- If the call **fails** (token missing, expired, or API error), `lib/projects.ts` falls back to `cachedGithubRepos`, so `/projects` continues to render the last known set of repos.
- The fallback is transparent to visitors. A warning is logged server-side.
- When you update `GITHUB_TOKEN` and the live fetch succeeds again, the snapshot is refreshed automatically on the next stale cycle (≥ 1 hour old).

## ScreenshotOne and Cloudinary

- ScreenshotOne captures desktop-sized image only.
- Cloudinary public ID stays deterministic (`portfolio/<repo-name>`).
- Failed screenshot updates preserve prior Cloudinary URL.
- Internal curation toggles GitHub `portfolio` topic to control visibility on `/projects`.

## Resend and Turnstile

- Contact send requires successful Turnstile verification.
- Resend delivery failures return non-success status and log diagnostic details.

## Operational Expectations

- CI can trigger refresh endpoint when deployment configuration is present.
- Refresh endpoint remains idempotent and safe to retry.
- Contracts should be versioned in docs whenever payloads or behavior change.

## Documentation Guardrail

- Keep this document provider-focused. Do not include raw credential values or private operational secrets.
