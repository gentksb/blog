import { defineConfig, passthroughImageService } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import AutoImport from "astro-auto-import"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import icon from "astro-icon"
import pagefind from "astro-pagefind"

console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`process.env.WORKERS_CI: ${process.env.WORKERS_CI}`)
console.log(`process.env.WORKERS_CI_BRANCH: ${process.env.WORKERS_CI_BRANCH}`)

// 本番環境かどうかの判定（本番ブランチかつCloudflare Workers CI環境）
const isProduction =
  process.env.WORKERS_CI_BRANCH === "master" &&
  process.env.NODE_ENV === "production"
// Cloudflare Workers CI環境での実行かどうか
const isCloudflareEnvironment = process.env.WORKERS_CI === "1"

console.log(`isProduction: ${isProduction}`)
console.log(`isCloudflareEnvironment: ${isCloudflareEnvironment}`)

// Cloudflare本番環境でのみ画像サービスを使用
const imageServiceConfig =
  isProduction && isCloudflareEnvironment
    ? {
        entrypoint: "./src/entrypoint/cfImageService",
        config: {
          maxWidth: 800
        }
      }
    : passthroughImageService()

// 本番環境のみ固定のURLをsiteに設定する
const siteUrl = isProduction
  ? "https://blog.gensobunya.net/"
  : "https://blog.gensobunya.net/"

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: "static",
  outDir: "./dist/",
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
  ]
})
