import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    EnvironmentPlugin(["VITE_IS_PRODUCTION", "NEXT_PUBLIC_LENS_NETWORK"])
  ],
  build: {
    target: "esnext",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.woff2$/.test(assetInfo.name ?? "")) {
            return "assets/fonts/[name][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },
        manualChunks: {
          wevm: ["wagmi", "family", "viem", "viem/zksync"],
          indexer: ["@hey/indexer"],
          react: [
            "react",
            "react-dom",
            "react-virtuoso",
            "react-easy-crop",
            "react-hook-form",
            "react-router",
            "react-tracked"
          ],
          prosekit: ["prosekit", "prosekit/core", "prosekit/react"],
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
          aws: ["@aws-sdk/client-s3", "@aws-sdk/lib-storage"],
          media: ["plyr-react", "@livepeer/react", "browser-image-compression"],
          misc: [
            "@lens-chain/storage-client",
            "@lens-protocol/metadata",
            "@apollo/client",
            "axios",
            "zustand",
            "tailwind-merge",
            "zod"
          ]
        }
      }
    }
  }
});
