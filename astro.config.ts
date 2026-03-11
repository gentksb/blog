import cloudflare from "@astrojs/cloudflare"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"
import AutoImport from "astro-auto-import"
import icon from "astro-icon"
import pagefind from "astro-pagefind"

console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`process.env.WORKERS_CI: ${process.env.WORKERS_CI}`)
console.log(`process.env.WORKERS_CI_BRANCH: ${process.env.WORKERS_CI_BRANCH}`)

// 本番環境かどうかの判定（本番ブランチかつCloudflare Workers CI環境）
const isProduction =
  process.env.WORKERS_CI_BRANCH === "master" &&
  process.env.NODE_ENV === "production"

// 本番のみCloudflare Image Resizingを使用（workers.devプレビューでは cdn-cgi/image が 404 になるため）
const imageService = isProduction ? "cloudflare" : "passthrough"
console.log(`imageService: ${imageService}`)

// 本番環境のみ固定のURLをsiteに設定する
const siteUrl = "https://blog.gensobunya.net/"

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: "server",
  outDir: "./dist/",
  adapter: cloudflare({
    imageService
  }),
  integrations: [
    AutoImport({
      imports: [
        "./src/components/mdx/LinkCard.astro",
        "./src/components/mdx/Amzn.astro",
        "./src/components/mdx/SimpleLinkCard.astro",
        "./src/components/mdx/PositiveBox.astro",
        "./src/components/mdx/NegativeBox.astro"
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
  ]
})
