#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

async function sortPackages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") {
          return;
        }
        await sortPackages(fullPath);
      } else if (entry.name === "package.json") {
        console.log(`Sorting ${fullPath}`);
        execSync(`npx sort-package-json ${fullPath}`, { stdio: "inherit" });
      }
    })
  );
}

console.log("Sorting package.json \ud83d\udce6");
await sortPackages(process.cwd());
console.log("package.json sorted \ud83c\udf89");
