import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import remarkDescription from "astro-remark-description"
import partytown from "@astrojs/partytown"

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gensobunya.net/",
  integrations: [
    AutoImport({
      imports: [
        "./src/components/mdx/Test.astro",
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
    partytown({
      config: {
        forward: ["dataLayer.push"]
      }
    })
  ],
  markdown: {
    remarkPlugins: [
      [
        remarkDescription,
        {
          name: "excerpt",
          override: true,
          skip: 1
        }
      ]
    ]
  },
  vite: {
    ssr: {
      // to fix react-icons ESM import error
      noExternal: ["react-icons"]
    }
  }
})
