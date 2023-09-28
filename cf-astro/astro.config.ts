import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import { componentIsHTMLElement } from "astro/runtime/server/render/dom.js"

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [
    AutoImport({
      imports: ["./src/components/mdx/Test.astro"]
    }),
    mdx(),
    sitemap(),
    tailwind()
  ]
})
