import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import { componentIsHTMLElement } from "astro/runtime/server/render/dom.js"

import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gensobunya.net/",
  integrations: [
    AutoImport({
      imports: [
        "./src/components/mdx/Test.astro",
        "./src/components/mdx/LinkBox.astro"
        // {
        //   "./src/components/mdx/positive.tsx": ["PositiveBox"],
        //   "./src/components/mdx/negative.tsx": ["NegativeBox"]
        // }
      ]
    }),
    mdx(),
    sitemap(),
    tailwind(),
    react()
  ]
})
