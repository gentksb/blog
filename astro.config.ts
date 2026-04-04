import cloudflare from "@astrojs/cloudflare"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"
import AutoImport from "astro-auto-import"
import pagefind from "astro-pagefind"
import tailwindcss from "@tailwindcss/vite"

// 本番ブランチのみ Cloudflare Image Resizing を使用
// （プレビュードメインでは cdn-cgi/image が 404 になるため）
const imageService =
  process.env.WORKERS_CI_BRANCH === "master" ? "cloudflare" : "passthrough"

// https://astro.build/config
export default defineConfig({
  site: "https://blog.gensobunya.net/",
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
    react(),
    pagefind()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
})
