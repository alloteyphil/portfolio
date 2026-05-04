# Bun Workflow

This project uses Bun as the default package manager for local development and release checks.

## Use This Document When

- Setting up a new local environment.
- Updating dependencies or package scripts.
- Validating command consistency across docs and CI.

## Standard Commands

- Install dependencies: `bun install`
- Start development server: `bun run dev`
- Lint: `bun run lint`
- Type checking: `bun run typecheck`
- Production build: `bun run build`
- Start production server: `bun run start`

## Package Manager Contract

- `bun.lock` is the canonical lockfile.
- Keep `packageManager` in `package.json` pinned to Bun.
- Do not add or commit lockfiles from other package managers.

## Update Workflow

1. Update `package.json` scripts and `packageManager` first.
2. Run `bun install` to refresh lockfile if dependencies changed.
3. Update command references in `README.md` and `docs/testing-checklist.md`.
4. Run `bun run lint`, `bun run typecheck`, and `bun run build`.

## Guardrails

- Prefer one package manager policy per repository.
- Keep human docs and executable scripts synchronized in the same PR.
- Do not leave mixed npm/Bun command references in docs.
