import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { ogImage } from "./_ogImage"

// astro/cloudflare アダプタ上のローカル開発環境では vercel/og が機能しないため、ビルド後に動作確認の必要あり
// bunだとメッセージがunexpectedのみだが、nodeの場合はwasm拡張しが認識されないエラーが出る
// Unknown file extension ".wasm" for /home/gen/blog/node_modules/@cloudflare/pages-plugin-vercel-og/dist/src/api/yoga.wasm

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params
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

  return ogImage(title, cover?.src)
}
