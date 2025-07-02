#!/usr/bin/env node
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";

async function removeTargets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") {
          await rm(fullPath, { force: true, recursive: true });
          console.log(`Deleted ${fullPath}`);
        } else {
          await removeTargets(fullPath);
        }
      } else if (
        entry.name === "pnpm-lock.yaml" ||
        entry.name === "tsconfig.tsbuildinfo"
      ) {
        await rm(fullPath, { force: true });
        console.log(`Deleted ${fullPath}`);
      }
    })
  );
}

console.log(
  "Deleting all node_modules and pnpm-lock.yaml files recursively \ud83d\uddd1"
);
await removeTargets(process.cwd());
console.log("node_modules and pnpm-lock.yaml files deleted \ud83c\udf89");
