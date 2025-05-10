import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-environment";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const dependenciesToChunk = {
  wevm: ["wagmi", "family", "viem", "viem/zksync"],
  indexer: ["@hey/indexer"],
  react: [
    "react",
    "react-dom",
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
    "@sentry/react-router",
    "@lens-chain/storage-client",
    "@lens-protocol/metadata",
    "@apollo/client",
    "zustand",
    "tailwind-merge",
    "virtua",
    "zod"
  ]
};

const navigateFallbackDenylist = [
  /^\/sitemap/,
  /^\/blog/,
  /^\/discord/,
  /^\/donate/
];

const bigIcon = { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" };

const manifest = {
  name: "Hey",
  short_name: "Hey",
  description:
    "Hey.xyz is a decentralized, and permissionless social media app built with Lens",
  categories: ["social", "decentralized", "lens"],
  lang: "en",
  theme_color: "#f9fafb",
  display: "standalone",
  icons: [
    { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
    bigIcon,
    { ...bigIcon, purpose: "any" },
    { ...bigIcon, purpose: "maskable" }
  ]
};

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: { navigateFallbackDenylist },
      manifest
    }),
    EnvironmentPlugin(["VITE_IS_PRODUCTION", "NEXT_PUBLIC_LENS_NETWORK"]),
    sentryVitePlugin({
      org: "heyverse",
      project: "web",
      telemetry: false,
      sourcemaps: { filesToDeleteAfterUpload: ["./dist/assets/*.js.map"] }
    })
  ],
  build: {
    sourcemap: true,
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
        manualChunks: dependenciesToChunk
      }
    }
  }
});
