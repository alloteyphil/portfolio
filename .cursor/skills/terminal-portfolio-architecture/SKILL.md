---
name: terminal-portfolio-architecture
description: Maps the portfolio's Next.js App Router structure, route responsibilities, and UI composition. Use when adding routes/components, refactoring layout/navigation, or tracing where rendering behavior lives.
---

# Terminal Portfolio Architecture

## Use This Skill When

- Adding or refactoring route-level UI in `app/`.
- Tracing where a visual behavior should live (`app/` vs `components/` vs `lib/`).
- Updating shared shell/navigation patterns.

## Do Not Use This Skill When

- Changing integration contracts (use data-pipeline/automation skills).
- Working on package-manager policy (use bun-workflow skill).

## Project Map

- Routes: `app/page.tsx`, `app/projects/page.tsx`, `app/about/page.tsx`, `app/blog/page.tsx`
- API route: `app/api/refresh-screenshots/route.ts`
- Shared UI: `components/site-nav.tsx`, `components/terminal-frame.tsx`, `components/project-card.tsx`
- Data/integrations: `lib/*`
- Domain types: `types/*`

## Workflow

1. Choose the owning layer first: route, shared component, or lib.
2. Keep page components focused on composition; move reusable UI to `components/`.
3. Keep data fetch/transform logic in `lib/` instead of component bodies.
4. Preserve terminal visual language and existing token usage.

## Guardrails

- Reuse `TerminalFrame` for page shells unless a page intentionally breaks shell style.
- Keep nav labels in prompt style (`~/...`).
- Prefer server components for data-driven rendering unless interactivity is required.
- Avoid duplicating card/layout logic across routes.

## Verification

- Run `bun run lint` and `bun run build` after substantive changes.
- Confirm affected routes still render with consistent shell/navigation behavior.
