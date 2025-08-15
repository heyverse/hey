const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Watch the workspace root so changes in shared packages are picked up
config.watchFolders = [workspaceRoot];

// Resolve modules from the app and the workspace root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules")
];

// Enable symlink support for pnpm
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
