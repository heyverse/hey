#!/usr/bin/env node
import { execSync } from "node:child_process";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

function run(command, options = {}) {
  return execSync(command, { stdio: "inherit", ...options });
}

function runGet(command, options = {}) {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  }).trim();
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (const arg of args) {
    if (arg.startsWith("--remote=")) parsed.remote = arg.split("=")[1];
    if (arg.startsWith("--branch=")) parsed.branch = arg.split("=")[1];
  }
  return parsed;
}

function ensureCleanWorkingTree() {
  const status = runGet("git status --porcelain");
  if (status.length > 0) {
    console.error(
      "Uncommitted changes detected. Commit or stash before syncing to public."
    );
    process.exit(1);
  }
}

function resolvePublicRemote() {
  const { remote: argRemote, branch: argBranch } = parseArgs();
  const remote = argRemote || process.env.PUBLIC_REMOTE || "public";
  const branch =
    argBranch ||
    process.env.PUBLIC_BRANCH ||
    runGet("git rev-parse --abbrev-ref HEAD");

  const DEFAULT_PUBLIC_URL = "git@github.com:heyverse/hey.git";

  // Try the requested remote first
  try {
    const remoteUrl = runGet(`git remote get-url ${remote}`);
    return { branch, remote, remoteUrl };
  } catch {}

  // If a non-"public" remote was requested but is missing, try the "public" remote
  if (remote !== "public") {
    try {
      const remoteUrl = runGet("git remote get-url public");
      return { branch, remote: "public", remoteUrl };
    } catch {}
  }

  // Ensure a "public" remote exists by adding it if necessary
  console.log(
    `Remote '${remote}' not found. Ensuring 'public' exists at ${DEFAULT_PUBLIC_URL}`
  );
  try {
    run(`git remote add public ${DEFAULT_PUBLIC_URL}`);
  } catch {}

  const remoteUrl = runGet("git remote get-url public");
  return { branch, remote: "public", remoteUrl };
}

async function main() {
  console.log(
    "Preparing public sync (excluding apps/api and packages/indexer) ✨"
  );
  ensureCleanWorkingTree();

  const { branch, remoteUrl } = resolvePublicRemote();

  const tmp = await mkdtemp(join(tmpdir(), "hey-public-"));
  console.log(`Using temporary directory: ${tmp}`);

  // Export the current tree into the temp directory
  // We export everything, then remove the disallowed paths to avoid tar pattern edge cases.
  run(`bash -lc "git archive --format=tar HEAD | tar -x -C '${tmp}'"`);

  // Remove private paths if present
  const disallowed = [
    "apps/api",
    "packages/indexer",
    ".cursorrules",
    "AGENTS.md"
  ];

  for (const rel of disallowed) {
    const full = join(tmp, rel);
    if (await pathExists(full)) {
      await rm(full, { force: true, recursive: true });
      console.log(`Excluded: ${rel}`);
    }
  }

  // Initialize a fresh git repo and push a single squashed snapshot
  run(`bash -lc "cd '${tmp}' && git init"`);
  run(`bash -lc "cd '${tmp}' && git checkout -b '${branch}'"`);
  // Set a predictable author in case none is configured in this environment
  run(
    `bash -lc "cd '${tmp}' && git config user.name 'Hey Bot' && git config user.email 'github@hey.xyz'"`
  );
  run(`bash -lc "cd '${tmp}' && git add -A"`);
  run(
    `bash -lc "cd '${tmp}' && git commit -m 'chore: release v$(git rev-parse --short HEAD)'"`
  );
  run(`bash -lc "cd '${tmp}' && git remote add origin '${remoteUrl}'"`);
  run(`bash -lc "cd '${tmp}' && git push -f origin '${branch}'"`);

  // Cleanup temp directory
  await rm(tmp, { force: true, recursive: true });
  console.log("Public sync completed and temporary directory cleaned up 🎉");
  console.log(`Pushed snapshot to ${remoteUrl} on branch '${branch}'.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
