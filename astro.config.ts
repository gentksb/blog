import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import partytown from "@astrojs/partytown"
import icon from "astro-icon"
import { rehypeExcerptContent } from "./src/plugin/rehypeExcerpt"
import wasmModuleWorkers from "vite-plugin-wasm-module-workers"

import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gensobunya.net/",
  integrations: [
    AutoImport({
      imports: [
        "./src/components/mdx/LinkCard.astro",
        "./src/components/mdx/Amzn.astro",
        {
          "./src/components/mdx/positive.tsx": ["PositiveBox"],
          "./src/components/mdx/negative.tsx": ["NegativeBox"]
        }
      ]
    }),
    mdx(),
    sitemap(),
    tailwind(),
    react(),
    icon(),
    partytown({
      config: {
        forward: ["dataLayer.push"]
      }
    })
  ],
  markdown: {
    rehypePlugins: [rehypeExcerptContent]
  },
  vite: {
    plugins: [wasmModuleWorkers()],
    ssr: {
      // to fix react-icons ESM import error
      noExternal: ["react-icons"]
    },
    build: {
      minify: false
    }
  },
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough"
  })
})
