/// <reference types="vitest" />

// import { getViteConfig } from "astro/config"
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config"
import * as path from "path"

// const astroConfig = getViteConfig({})

const workersConfig = defineWorkersConfig({
  test: {
    testTimeout: 15000,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@type": path.resolve(__dirname, "./@types")
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          compatibilityDate: "2024-05-13",
          compatibilityFlags: ["nodejs_compat"]
        }
      }
    }
  }
})

const config = { ...workersConfig }

export default config
