# Repository Agent Guidelines

This project uses the coding and collaboration rules defined in `.cursorrules`.

## General Principles

- Implement requests thoroughly and adhere strictly to the requirements.
- Plan solutions carefully before writing any code.
- Produce clean, functional code that follows best practices.
- Prioritize readability over performance and avoid duplication.
- Include all required imports and use clear, descriptive names.
- Remove placeholders or incomplete sections before committing.

## Tech Stack

- React with Vite and TypeScript
- HeadlessUI, Tailwind CSS, and Radix
- Apollo GraphQL with Hono
- Prisma with Postgres
- Zustand and TanStack React Query
- Zod for validation
- Prosekit with Remark and Rehype

## Implementation Guidelines

- Use early returns and guard clauses.
- Export default React components at the end of each file.
- Style elements exclusively with Tailwind classes.
- Name event handlers with a `handle` prefix (e.g., `handleClick`).
- Add accessibility attributes like `tabIndex`, `aria-label`, and keyboard handlers.
- Prefer arrow functions and define types or interfaces for props.
- Place files in pnpm workspaces and keep packages isolated.
- Handle errors early with custom error types when appropriate.
- Favor derived state and memoization over excessive `useEffect`.
- Use interfaces for props and avoid enums, preferring literal types.
- Follow camelCase naming and use verbs for boolean flags.
- Organize exports, subcomponents, helpers, static content, and types within files.

## References

- [Lens Protocol Documentation](https://lens.xyz/docs/protocol)
- [Grove Storage Documentation](https://lens.xyz/docs/storage)

## Required Commands

Run these commands before committing:

- `pnpm biome:check`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test`

## PR Instructions

- Use a conventional commit message for the title.
- Example: `feat: allow provided config object to extend other configs`.
- Keep the title under 50 characters.
