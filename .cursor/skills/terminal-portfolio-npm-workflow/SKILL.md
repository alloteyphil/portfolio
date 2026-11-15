---
name: terminal-portfolio-npm-workflow
description: Standardizes npm usage, lockfile policy, and command conventions for this repository. Use when changing dependencies, scripts, setup docs, or local/CI command references.
---

# Terminal Portfolio npm Workflow

## Use This Skill When

- Installing/updating dependencies.
- Updating setup or testing command docs.
- Resolving lockfile or package-manager drift.

## Canonical Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Production build: `npm run build`
- Start production server: `npm run start`

## Package Manager Contract

- Treat `package-lock.json` as the only lockfile source of truth.
- Do not commit `bun.lock`, `yarn.lock`, or `pnpm-lock.yaml`.
- Keep `packageManager` in `package.json` aligned with npm.

## Workflow

1. Run `npm install` after dependency changes.
2. Update docs whenever command expectations change.
3. Run `npm run lint`, `npm run typecheck`, and `npm run build` before merge.

## Guardrails

- Keep documentation and executable scripts aligned in the same PR.
- Prefer command consistency across local usage and CI usage.
- Avoid introducing mixed package-manager instructions.

## Common Touchpoints

- `package.json`
- `README.md`
- `docs/testing-checklist.md`
- `docs/implementation-plan.md`
