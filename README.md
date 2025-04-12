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

### Setup Environment Variables

Copy the `.env.example` file to create a new `.env` file for each package or app that requires environment configuration:

```bash
cp .env.example .env
```

Repeat this process for all relevant packages and applications in the monorepo.

### Start the Development Server

To run the application in development mode:

```bash
pnpm dev
```

## Build and Test

### Build the Application

To compile the application:

```bash
pnpm build
```

## License

This project is licensed under the **AGPL-3.0** license. Please refer to the [LICENSE](./LICENSE) file for full terms and conditions.

## P.S

We 💖 you to the moon and back! Your support is like a never-ending supply of coffee for our code. Thank you for making Hey the most awesome place in the universe!

🌸
