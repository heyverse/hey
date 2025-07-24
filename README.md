# Hey Monorepo

## Requirements

To start working with the Hey monorepo, ensure the following tools are installed:

- [Node.js](https://nodejs.org/en/download/) (v18 or higher) – the JavaScript runtime used in this project.
- [pnpm](https://pnpm.io/installation) – the package manager used throughout this repository.
- [Postgres App](https://postgresapp.com/) – the Postgres database used in development.

## Installation

This repository uses [pnpm workspaces](https://pnpm.io/workspaces) to manage multiple packages within a monorepo structure.

### Clone the Repository

```bash
git clone git@github.com:heyverse/hey.git
```

### Install NVM and pnpm

On macOS you can install both with Homebrew:

```bash
brew install nvm pnpm
```

### Install Node.js

Use `nvm` to install the required Node.js version:

```bash
nvm install
```

### Install Dependencies

From the repository root, install dependencies with pnpm:

```bash
pnpm install
```

### Set up Environment Variables

Copy the `.env.example` file to `.env` for each package or application that requires configuration:

```bash
cp .env.example .env
```

Repeat this process for all relevant packages and applications in the monorepo.

### Environment Variables

The example environment files define the following variables:

#### API (`apps/api/.env.example`)

- `NEXT_PUBLIC_LENS_NETWORK` – Lens network to use (`mainnet`, `testnet`, or `staging`).
- `DATABASE_URL` – Connection string for the main Postgres database.
- `LENS_DATABASE_URL` – Read-only Postgres connection for Lens data.
- `REDIS_URL` – Redis connection string for caching.
- `PRIVATE_KEY` – Private key used to sign Lens requests.
- `EVER_ACCESS_KEY` – Access key for 4EVERLAND storage.
- `EVER_ACCESS_SECRET` – Secret key for 4EVERLAND storage.
- `SHARED_SECRET` – Token for internal API authorization.
- `OPENROUTER_API_KEY` – API key for OpenRouter AI services.

#### Web (`apps/web/.env.example`)

- `VITE_IS_PRODUCTION` – Boolean flag indicating production mode for Vite.
- `NEXT_PUBLIC_LENS_NETWORK` – Lens network used by the web app.

### Start the Development Server

To run the application in development mode:

```bash
pnpm dev
```

## Code Generation

Generate Prisma clients and GraphQL types across all workspaces:

```bash
pnpm codegen
```

## Build and Test

### Build the application

Compile the application:

```bash
pnpm build
```

### Type-check the project

Validate the codebase with the TypeScript type checker:

```bash
pnpm typecheck
```

### Run tests

Execute unit tests across all workspaces:

```bash
pnpm test
```

Each workspace provides its own `vitest.config.ts`, so test behavior is scoped
to that package. Vitest prints a summary for each workspace showing how many
files and tests passed along with the execution time.

### Lint and Format Code

Check code quality and formatting with Biome:

```bash
pnpm biome:check
```

Automatically fix linting and formatting issues:

```bash
pnpm biome:fix
```

### Maintenance Scripts

Convenient Node.js helpers are in the `script` directory:

- `node script/clean.mjs` removes all `node_modules`, `.next` directories,
  `pnpm-lock.yaml`, and `tsconfig.tsbuildinfo` files.
- `node script/update-dependencies.mjs` updates packages across the monorepo,
  removes old installs and commits the changes in a new branch.
- `node script/sort-package-json.mjs` sorts all `package.json` files in the
  repository.

## License

This project is released under the **GNU AGPL-3.0** license. See the [LICENSE](./LICENSE) file for details.

🌸
