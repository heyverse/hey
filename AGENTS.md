# Repository Agent Guidelines

This repository follows coding and collaboration conventions summarized from `.cursorrules`.

## General Principles

- Implement requests thoroughly and follow requirements precisely.
- Think through solutions step by step before writing code.
- Produce clean, fully functional code aligned with best practices.
- Prioritize readability over performance and avoid duplication.
- Include all necessary imports and use clear, descriptive names.
- Remove placeholders or incomplete sections before committing.

## Tech Stack

- React and Vite with TypeScript
- HeadlessUI, Tailwind CSS, Radix
- Apollo GraphQL, Hono
- Prisma with Postgres
- Zustand, TanStack React Query
- Zod for validation
- Prosekit with Remark and Rehype

## Implementation Guidelines

- Use early returns and guard clauses.
- Always export default React components at the end of each file.
- Style elements with Tailwind classes only.
- Name event handlers with a `handle` prefix (e.g., `handleClick`).
- Add accessibility attributes such as `tabIndex`, `aria-label`, and keyboard handlers.
- Prefer arrow functions and define types or interfaces for props.
- Place files in pnpm workspaces and keep packages isolated.
- Handle errors early with custom error types when appropriate.
- Favor derived state and memoization instead of excessive `useEffect`.
- Use interfaces for props and avoid enums, preferring literal types.
- Follow camelCase naming and use verbs for boolean flags.
- Organize exports, subcomponents, helpers, static content, and types within files.

## References

- [Lens Protocol Docs](https://lens.xyz/docs/protocol)
- [Grove Storage Docs](https://lens.xyz/docs/storage)

## Note

Make sure to run all the following commands before committing:

- pnpm test
- pnpm biome:check
- pnpm typecheck
- pnpm build
