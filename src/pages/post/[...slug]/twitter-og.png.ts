import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { ogImage } from "./_ogImage"

// astro/cloudflare アダプタ上のローカル開発環境では vercel/og が機能しないため、ビルド後に動作確認の必要あり
// bunだとメッセージがunexpectedのみだが、nodeの場合はwasm拡張しが認識されないエラーが出る
// Unknown file extension ".wasm" for /home/gen/blog/node_modules/@cloudflare/pages-plugin-vercel-og/dist/src/api/yoga.wasm

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

  return await ogImage(origin, title, coverSrc)
}
