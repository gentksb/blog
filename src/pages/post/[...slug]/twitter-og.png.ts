import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { ogImage } from "./_ogImage"

// astro/cloudflare アダプタ上のローカル開発環境では vercel/og が機能しないため、ビルド後に動作確認の必要あり. Esbuildだけおかしい？
// ERROR: No loader is configured for ".bin" files: node_modules/.pnpm/@cloudflare+pages-plugin-vercel-og@0.1.2/node_modules/@cloudflare/pages-plugin-vercel-og/dist/src/api/noto-sans-v27-latin-regular.ttf.bin
// workers-ogだとアクセス時に下記エラー
// Unknown file extension ".wasm" for /home/gen/blog/node_modules/.pnpm/workers-og@0.0.24/node_modules/workers-og/dist/yoga-ZMNYPE6Z.wasm

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params
  const origin = new URL(request.url).origin
  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    })
  }
  const entry = await getEntry("post", slug)
  if (!entry) {
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    })
  }
  const { cover, title } = entry.data
  const coverSrc = cover?.src
    ? origin + cover.src
    : "https://blog.gensobunya.net/image/logo.jpg"

  console.log("coverSrc", coverSrc)

  return await ogImage(title, coverSrc)
}
