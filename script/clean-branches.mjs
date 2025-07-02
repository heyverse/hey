#!/usr/bin/env node
import { execSync } from "node:child_process";

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function getLocalBranches() {
  const output = execSync("git branch", { encoding: "utf8" });
  return output
    .split("\n")
    .map((b) => b.replace("*", "").trim())
    .filter(Boolean);
}

console.log("Deleting all branches except 'main' \ud83d\uddd1");
const branches = getLocalBranches().filter((b) => b !== "main");
for (const branch of branches) {
  run(`git branch -D ${branch}`);
}

console.log("Deleting branches that no longer exist on remote \ud83d\uddd1");
run("git fetch -p");
const goneOutput = execSync(
  "git for-each-ref --format='%(refname) %(upstream:track)' refs/heads",
  { encoding: "utf8" }
);
const goneBranches = goneOutput
  .split("\n")
  .filter(Boolean)
  .map((line) => line.trim().split(" "))
  .filter(([, status]) => status === "[gone]")
  .map(([ref]) => ref.replace("refs/heads/", ""));
for (const branch of goneBranches) {
  run(`git branch -D ${branch}`);
}
console.log("Branches deleted \ud83c\udf89");
