import { getCollection } from "astro:content"
import { slugFromId } from "@lib/postSlug"
import type { APIRoute } from "astro"
import { ogImage } from "../../../server/services/ogImage"
// `@vercel/og` は Workers 環境で使用不可

export const prerender = false

export const GET: APIRoute = async ({ params, url }) => {
  const slug = params.slug
  if (!slug) return new Response("Not Found", { status: 404 })

  try {
    const posts = await getCollection("post")
    const post = posts.find((p) => slugFromId(p.id) === slug)

    if (!post) return new Response("Not Found", { status: 404 })

    const title = post.data.title

    // カバー画像URLを取得（env.ASSETS.fetch() でアクセスできる静的アセットパスを使用）
    // getImage() は imageService モードによって /_image?href=... を返すことがあり、
    // env.ASSETS では静的ファイルのみアクセスできるため直接 .src を使う
    const coverSrc = post.data.cover
      ? `${url.origin}${post.data.cover.src}`
      : `${url.origin}/image/logo.jpg`

    const imageResponse = await ogImage(title, coverSrc, url.origin)
    // Cloudflare CDN にエッジキャッシュさせる（OGP画像は記事更新時以外変化しない）
    const headers = new Headers(imageResponse.headers)
    headers.set("Cache-Control", "public, max-age=604800")
    headers.set("CDN-Cache-Control", "public, max-age=2592000")
    return new Response(imageResponse.body, {
      status: imageResponse.status,
      headers
    })
  } catch (error) {
    console.error("twitter-og.png generation error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
