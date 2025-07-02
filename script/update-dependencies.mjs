#!/usr/bin/env node
import { execSync } from "node:child_process";
import { format } from "node:util";

function exec(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function hasChanges() {
  const output = execSync("git status --porcelain").toString().trim();
  return output.length > 0;
}

if (hasChanges()) {
  console.error(
    "Uncommitted changes detected. Please commit or stash them before running this script."
  );
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const branchName = format(
  "update-dependencies-%d-%s-%s-%s-%s",
  now.getFullYear(),
  pad(now.getMonth() + 1),
  pad(now.getDate()),
  pad(now.getHours()),
  pad(now.getMinutes())
);
const commitMessage = "chore: Update dependencies across all packages";

exec(`git checkout -b ${branchName}`);
exec("pnpm update --interactive --recursive --latest");

if (!hasChanges()) {
  console.log("No changes in dependencies. Exiting.");
  process.exit(0);
}

exec("node ./script/clean.mjs");
exec("pnpm install");
exec("git add .");
exec(`git commit -m "${commitMessage}"`);
exec(`git push -u origin ${branchName}`);
console.log(`Dependencies updated and pushed to branch ${branchName}.`);
