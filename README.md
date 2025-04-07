# Hey Monorepo

## Requirements

- [Node.js](https://nodejs.org/en/download/) (v18 or higher) - The backbone of our project, make sure you have this installed.
- [pnpm](https://pnpm.io/installation) - Our trusty package manager, because who doesn't love faster installs?
- [Postgres App](https://postgresapp.com/) - Our database of choice, because data needs a cozy home.

## Installation

We harness the power of [pnpm workspaces](https://pnpm.io/workspaces) to keep our monorepo running smoother than a freshly buttered pancake.

### Clone the repository

Clone the Hey monorepo to your local machine:

```bash
git clone git@git.pierre.co:yo/hey.git
```

### Install NVM (Node Version Manager) and pnpm

Rocking a macOS? You can grab both with Homebrew, like a true brew master:

```bash
brew install nvm pnpm
```

### Install Node.js

Use `nvm` to summon the magical version of Node.js you need:

```bash
nvm install
```

### Install dependencies

Teleport yourself to the root of the repository and let pnpm sprinkle its dependency magic:

```bash
pnpm install
```

### Create a `.env` file

Channel your inner wizard and conjure up a `.env` file from the `.env.example` template for every package and app that needs it. Don't forget to sprinkle in the necessary environment variables!

```bash
cp .env.example .env
```

Don't forget to play copycat and repeat this `.env` file creation for every package and app that needs it. Consistency is key!

### Start the application

When all the stars align and everything is in place, kick off the application in development mode:

```bash
pnpm dev
```

## Build and Test

### Build the application

Ready to build the application? Just run this command:

```bash
pnpm build
```

## License

This project is open-sourced under the **AGPL-3.0** license. For all the nitty-gritty details, check out the [LICENSE](./LICENSE) file. It's a real page-turner!

## P.S

We 💖 you to the moon and back! Your support is like a never-ending supply of coffee for our code. Thank you for making Hey the most awesome place in the universe!

🌸
