import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import partytown from "@astrojs/partytown"
import icon from "astro-icon"
import { imageService } from "@unpic/astro/service"

// ローカル開発のために環境変数を設定
const isCfPages = process.env.CF_PAGES === "1" ? true : false
const mainImageService = isCfPages ? "imgix" : "astro"
console.log(
  `CF_PAGES detect: ${isCfPages}, mainImageService: ${mainImageService}`
)

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gensobunya.net/",
  image: {
    service: imageService({
      fallbackService: mainImageService,
      cdnOptions: {
        imgix: {
          domain: "gensobunya.imgix.net",
          defaultParams: {
            auto: "format,compress",
            w: "800"
          }
        }
      }
    })
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
