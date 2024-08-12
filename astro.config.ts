import { defineConfig, passthroughImageService } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import icon from "astro-icon"
import pagefind from "astro-pagefind"

console.log(
  `meta CF_PAGES: ${import.meta.env.CF_PAGES}\nprocess.env.CF_PAGES: ${process.env.CF_PAGES}`
)

// ローカル開発時は画像サービスをパススルー
const imageServiceConfig =
  import.meta.env.CF_PAGES === 1
    ? {
        entrypoint: "./src/entrypoint/cfImageService",
        config: {
          maxWidth: 800
        }
      }
    : passthroughImageService()

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gensobunya.net/",
  image: {
    service: imageServiceConfig
  },
  integrations: [
    AutoImport({
      imports: [
        "./src/components/mdx/LinkCard.astro",
        "./src/components/mdx/Amzn.astro",
        "./src/components/mdx/SimpleLinkCard.astro",
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
    icon({
      include: {
        mdi: [
          "calendar",
          "twitter",
          "instagram",
          "youtube",
          "web",
          "open-in-new"
        ]
      }
    }),
    pagefind()
  ],
  build: {
    format: "file"
  }
})
