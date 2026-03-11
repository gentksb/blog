import { getCollection } from "astro:content"
import { getImage } from "astro:assets"
import { slugFromId } from "@lib/postSlug"
import type { APIRoute } from "astro"
import { ogImage } from "../../../server/services/ogImage"

export const prerender = false

export const GET: APIRoute = async ({ params, url }) => {
  const slug = params.slug
  if (!slug) return new Response("Not Found", { status: 404 })

  try {
    const posts = await getCollection("post")
    const post = posts.find((p) => slugFromId(p.id) === slug)

    if (!post) return new Response("Not Found", { status: 404 })

    const title = post.data.title

    // カバー画像URLを取得（ASSETSから読み込める形式で）
    let coverSrc = `${url.origin}/image/logo.jpg` // fallback
    if (post.data.cover) {
      const img = await getImage({ src: post.data.cover, format: "jpeg" })
      coverSrc = `${url.origin}${img.src}`
    }

    return await ogImage(title, coverSrc, url.origin)
  } catch (error) {
    console.error("twitter-og.png generation error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
