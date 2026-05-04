<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the portfolio v2 project. Here is a summary of every change made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using `posthog-js` via Next.js 15.3+ `instrumentation-client.ts`. Configured with a `/ingest` reverse proxy, `capture_exceptions: true` for automatic error tracking, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node` for API route tracking.
- **`next.config.ts`** (updated): Added `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` rewrites pointing to `us-assets.i.posthog.com` / `us.i.posthog.com`, plus `skipTrailingSlashRedirect: true`.
- **`components/contact-form.tsx`** (updated): Captures `contact_form_validation_failed` (with field names), `contact_form_submitted`, and `contact_form_failed` (with error message and status code). Also calls `posthog.captureException()` on network errors.
- **`components/project-card.tsx`** (updated): Added `"use client"` directive and `onClick` captures for `project_source_link_clicked` and `project_live_link_clicked`, both with `project_name` property.
- **`app/page.tsx`** (updated): Added `"use client"` directive and `onClick` captures for `home_cta_clicked` with a `destination` property (`"projects"` or `"about"`).
- **`app/api/contact/route.ts`** (updated): Added server-side `contact_message_received` event using `posthog-node`, fired only after the email is confirmed sent. Uses the sender's email as `distinctId`.

| Event | Description | File |
|---|---|---|
| `contact_form_validation_failed` | Client-side validation failed before submission | `components/contact-form.tsx` |
| `contact_form_submitted` | Contact form submitted and message sent successfully | `components/contact-form.tsx` |
| `contact_form_failed` | Contact form submission failed (server error or network error) | `components/contact-form.tsx` |
| `project_source_link_clicked` | Visitor clicked the GitHub source link on a project card | `components/project-card.tsx` |
| `project_live_link_clicked` | Visitor clicked the live site link on a project card | `components/project-card.tsx` |
| `home_cta_clicked` | Visitor clicked a CTA button on the home page | `app/page.tsx` |
| `contact_message_received` | Server confirmed successful delivery of a contact message | `app/api/contact/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/409157/dashboard/1542044
- **Contact form conversion funnel**: https://us.posthog.com/project/409157/insights/aA5OHqQE
- **Contact form submissions over time**: https://us.posthog.com/project/409157/insights/BjNZvGl3
- **Project link clicks by project**: https://us.posthog.com/project/409157/insights/V756o3VK
- **Home CTA click breakdown**: https://us.posthog.com/project/409157/insights/Ce70msEw
- **Contact messages received (server-side)**: https://us.posthog.com/project/409157/insights/70iflhMm

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
