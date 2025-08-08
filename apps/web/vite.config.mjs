import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import tsconfigPaths from "vite-tsconfig-paths";

const dependenciesToChunk = {
  aws: ["@aws-sdk/client-s3", "@aws-sdk/lib-storage"],
  editor: [
    "react-markdown",
    "unified",
    "rehype-parse",
    "rehype-remark",
    "remark-breaks",
    "remark-html",
    "remark-linkify-regex",
    "remark-stringify",
    "strip-markdown"
  ],
  indexer: ["@hey/indexer"],
  media: ["plyr-react", "@livepeer/react", "browser-image-compression"],
  misc: [
    "@lens-chain/storage-client",
    "@lens-protocol/metadata",
    "@apollo/client",
    "zustand",
    "tailwind-merge",
    "virtua",
    "zod"
  ],
  prosekit: ["prosekit", "prosekit/core", "prosekit/react"],
  react: [
    "react",
    "react-dom",
    "react-easy-crop",
    "react-hook-form",
    "react-router",
    "react-tracked"
  ],
  ui: [
    "@headlessui/react",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-slider",
    "@radix-ui/react-tooltip",
    "@uidotdev/usehooks",
    "sonner",
    "motion",
    "motion-plus-react"
  ],
  wevm: ["wagmi", "family", "viem", "viem/zksync"]
};

export default defineConfig({
  build: {
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.woff2$/.test(assetInfo.name ?? "")) {
            return "assets/fonts/[name][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },
        manualChunks: dependenciesToChunk
      }
    },
    sourcemap: true,
    target: "esnext"
  },
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    EnvironmentPlugin(["VITE_IS_PRODUCTION", "LENS_NETWORK"])
  ]
});
