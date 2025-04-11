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
          wevm: ["viem", "wagmi", "family"],
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
          editor: [
            "react-markdown",
            "strip-markdown",
            "unified",
            "prosekit",
            "rehype-parse",
            "rehype-remark",
            "remark-breaks",
            "remark-html",
            "remark-linkify-regex",
            "remark-stringify"
          ],
          ui: [
            "@heroicons/react",
            "@headlessui/react",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-slider",
            "@radix-ui/react-tooltip",
            "@uidotdev/usehooks",
            "sonner",
            "motion"
          ],
          aws: ["@aws-sdk/client-s3", "@aws-sdk/lib-storage"],
          media: ["plyr-react", "@livepeer/react", "browser-image-compression"],
          misc: [
            "@lens-chain/storage-client",
            "@lens-protocol/metadata",
            "@apollo/client",
            "zustand",
            "tailwind-merge",
            "zod"
          ]
        }
      }
    }
  }
});
