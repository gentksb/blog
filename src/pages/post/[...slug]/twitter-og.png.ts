import { getEntry } from "astro:content"
import type { APIRoute } from "astro"
import { ogImage } from "../../../server/services/ogImage"
// `@vercel/og` は Workers 環境で使用不可

export const prerender = false

// CDN-Cache-Control 単体では Worker 応答はエッジに載らないため Cache API を併用する
const GENERATED_CACHE_CONTROL = "public, max-age=604800"
const GENERATED_CDN_CACHE_CONTROL = "public, max-age=2592000"
const FALLBACK_CACHE_CONTROL = "public, max-age=300"

// caches.default は DOM の CacheStorage 型に無く、DOM lib が同名を先に解決するため使わない
let ogCache: Promise<Cache> | undefined
const getOgCache = () => (ogCache ??= caches.open("og-image"))

export const GET: APIRoute = async ({ params, url, locals }) => {
  const slug = params.slug
  if (!slug) return new Response("Not Found", { status: 404 })

  try {
    const cache = await getOgCache()
    const cacheKey = url.toString()
    const cached = await cache.match(cacheKey)
    if (cached) return cached

    const post = await getEntry("post", slug)
    if (!post) return new Response("Not Found", { status: 404 })

    const title = post.data.title

    // カバー画像URLを取得（env.ASSETS.fetch() でアクセスできる静的アセットパスを使用）
    // getImage() は imageService モードによって /_image?href=... を返すことがあり、
    // env.ASSETS では静的ファイルのみアクセスできるため直接 .src を使う
    const coverSrc = post.data.cover
      ? `${url.origin}${post.data.cover.src}`
      : `${url.origin}/image/logo.jpg`

    const { response, fallback } = await ogImage(title, coverSrc, url.origin)

    const headers = new Headers(response.headers)
    if (fallback) {
      headers.set("Cache-Control", FALLBACK_CACHE_CONTROL)
    } else {
      headers.set("Cache-Control", GENERATED_CACHE_CONTROL)
      headers.set("CDN-Cache-Control", GENERATED_CDN_CACHE_CONTROL)
    }

    const result = new Response(response.body, {
      status: response.status,
      headers
    })

    // フォールバック画像を長期キャッシュするとフォント取得の復旧後も残るため載せない
    if (!fallback && result.status === 200) {
      locals.cfContext.waitUntil(cache.put(cacheKey, result.clone()))
    }

    return result
  } catch (error) {
    console.error("twitter-og.png generation error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
