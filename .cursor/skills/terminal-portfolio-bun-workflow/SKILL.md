---
name: terminal-portfolio-bun-workflow
description: Standardizes Bun usage, lockfile policy, and command conventions for this repository. Use when changing dependencies, scripts, setup docs, or local/CI command references.
---

# Terminal Portfolio Bun Workflow

## Use This Skill When

- Installing/updating dependencies.
- Updating setup or testing command docs.
- Resolving lockfile or package-manager drift.

## Canonical Commands

- Install dependencies: `bun install`
- Start dev server: `bun run dev`
- Lint: `bun run lint`
- Typecheck: `bun run typecheck`
- Production build: `bun run build`
- Start production server: `bun run start`

## Package Manager Contract

- Treat `bun.lock` as the only lockfile source of truth.
- Do not commit `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`.
- Keep `packageManager` in `package.json` aligned with Bun.

## Workflow

1. Run `bun install` after dependency changes.
2. Update docs whenever command expectations change.
3. Run `bun run lint`, `bun run typecheck`, and `bun run build` before merge.

## Guardrails

- Keep documentation and executable scripts aligned in the same PR.
- Prefer command consistency across local usage and CI usage.
- Avoid introducing mixed package-manager instructions.

## Common Touchpoints

- `package.json`
- `README.md`
- `docs/testing-checklist.md`
- `docs/implementation-plan.md`
