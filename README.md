# Hey Monorepo

## Requirements

To get started with the Hey monorepo, ensure the following dependencies are installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v18 or higher) - The backbone of our project.
- [pnpm](https://pnpm.io/installation) - Our trusty package manager.
- [Postgres App](https://postgresapp.com/) - Our database of choice.

## Installation

This repository uses [pnpm workspaces](https://pnpm.io/workspaces) to manage multiple packages within a monorepo structure.

### Clone the Repository

```bash
git clone git@github.com:heyverse/hey.git
```

### Install NVM and pnpm

If you're on macOS, both can be installed via Homebrew:

```bash
brew install nvm pnpm
```

### Install Node.js

Use `nvm` to install the correct Node.js version:

```bash
nvm install
```

### Install Dependencies

Navigate to the root of the repository and install all dependencies using pnpm:

```bash
pnpm install
```

### Set Up Environment Variables

Copy the `.env.example` file to create a new `.env` file for each package or app that requires environment configuration:

```bash
cp .env.example .env
```

Repeat this process for all relevant packages and applications in the monorepo.

### Environment Variables

Below is a brief description of the variables defined in the example environment files.

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

Run code generation to generate Prisma client and GraphQL types across all workspaces:

```bash
pnpm codegen
```

## Build and Test

### Build the Application

To compile the application:

```bash
pnpm build
```

### Type Check the Project

Run the TypeScript type checker to validate the codebase:

```bash
pnpm typecheck
```

### Lint and Format Code

Check code quality and formatting:

```bash
pnpm biome:check
```

Fix linting and formatting issues automatically:

```bash
pnpm biome:fix
```

## License

This project is licensed under the **AGPL-3.0** license. Please refer to the [LICENSE](./LICENSE) file for full terms and conditions.

🌸
