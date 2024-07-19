import { defineConfig, passthroughImageService } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import partytown from "@astrojs/partytown"
import icon from "astro-icon"

// ローカル開発時は画像サービスをパススルー
const imageServiceConfig = import.meta.env.DEV
  ? passthroughImageService()
  : {
      entrypoint: "./src/entrypoint/cfImageService",
      config: {
        maxWidth: 800
      }
    }

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
    partytown({
      config: {
        forward: ["dataLayer.push"]
      }
    })
  ],
  vite: {
    build: {
      minify: false
    }
  }
})
