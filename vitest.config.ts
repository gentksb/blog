/// <reference types="vitest" />

import { cloudflareTest } from "@cloudflare/vitest-pool-workers"
import { defineConfig } from "vitest/config"
import * as path from "path"

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        compatibilityDate: "2024-05-13",
        compatibilityFlags: ["nodejs_compat_v2"]
      }
    })
  ],
  test: {
    testTimeout: 15000,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@type": path.resolve(__dirname, "./@types")
    }
  }
})
