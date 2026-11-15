# npm Workflow

This project uses npm as the default package manager for local development and release checks.

## Use This Document When

- Setting up a new local environment.
- Updating dependencies or package scripts.
- Validating command consistency across docs and CI.

## Standard Commands

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Lint: `npm run lint`
- Type checking: `npm run typecheck`
- Production build: `npm run build`
- Start production server: `npm run start`

## Package Manager Contract

- `package-lock.json` is the canonical lockfile.
- Keep `packageManager` in `package.json` pinned to npm.
- Do not add or commit lockfiles from other package managers (`bun.lock`, `yarn.lock`, `pnpm-lock.yaml`).

## Update Workflow

1. Update `package.json` scripts and `packageManager` first.
2. Run `npm install` to refresh the lockfile if dependencies changed.
3. Update command references in `README.md` and `docs/testing-checklist.md`.
4. Run `npm run lint`, `npm run typecheck`, and `npm run build`.

## Guardrails

- Prefer one package manager policy per repository.
- Keep human docs and executable scripts synchronized in the same PR.
- Do not leave mixed npm/Bun command references in docs.
