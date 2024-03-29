import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
// import remarkDescription from "astro-remark-description"
import partytown from "@astrojs/partytown"
import icon from "astro-icon"
import { rehypeExcerptContent } from "./src/plugin/rehypeExcerpt"

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gensobunya.net/",
  integrations: [
    AutoImport({
      imports: [
        "./src/components/mdx/LinkBox.astro",
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
    ssr: {
      // to fix react-icons ESM import error
      noExternal: ["react-icons"]
    }
  }
})
