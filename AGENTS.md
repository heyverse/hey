# Repository Guidelines

## Project Structure & Modules

- `apps/web`: Vite + React 19 frontend (sources under `src/`, static assets in `public/`).
- `apps/api`: Hono-based API server (entry `src/index.ts`, routes in `src/routes/`).
- `packages/*`: Shared code (`helpers`, `data`, `types`, `indexer`, `config`).
- `script/*`: Maintenance utilities (e.g., sorting `package.json`, cleaning branches).
- Tooling: PNPM workspaces (`pnpm-workspace.yaml`), Biome config (`biome.json`), Husky hooks (`.husky/`).

## Build, Test, and Development

- Root dev: `pnpm dev` — run all workspaces in watch mode.
- Root build: `pnpm build` — build all workspaces in parallel.
- Web app: `pnpm -F @hey/web dev` (preview: `pnpm -F @hey/web start`, build: `pnpm -F @hey/web build`).
- API: `pnpm -F @hey/api dev` (typecheck: `pnpm -F @hey/api typecheck`).
- Lint/format: `pnpm biome:check` (auto-fix: `pnpm biome:fix`).
- Types: `pnpm typecheck` — TypeScript across the monorepo.
- Node & PM: Node 20 (`.nvmrc`), PNPM 10 (see `package.json#packageManager`).

## Coding Style & Naming

- Language: TypeScript (strict, shared configs in `packages/config`).
- Formatting: Biome controls style; no trailing commas; spaces for indentation.
- Imports: Use workspace packages (`@hey/*`) and web alias `@/*` to `apps/web/src`.
- Files: React components `PascalCase.tsx`; helpers/stores `camelCase.ts`.
- Keep modules small, colocate domain helpers with their feature when practical.

## Testing Guidelines

- Current status: no formal unit tests present. Enforce quality via `biome` and `tsc`.
- If adding tests, prefer Vitest for web and lightweight integration tests for API.
- Naming: `*.test.ts` or `*.test.tsx`, colocated with the code or under `__tests__/`.
- Run with a future `pnpm test` script at root or per package.

## Commit & Pull Requests

- Commits: imperative mood, concise subject; optional scope like `web:`, `api:`, `helpers:`.
- Include rationale and references (e.g., `Closes #123`).
- PRs: clear description, screenshots for UI changes, reproduction steps for fixes, and env notes.
- CI hooks: pre-commit runs `biome` and type checks; ensure both pass locally before pushing.

## Security & Configuration

- Copy `.env.example` to `.env` in `apps/web` and `apps/api`. Never commit secrets.
- Validate envs at startup; keep keys minimal and documented near usage.
