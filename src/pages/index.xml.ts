import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../consts"
import { timeOrderPosts as posts } from "../lib/timeOrderPosts"
import type { APIContext } from "astro"

// render()しないとexcerptを生成できないが、items内はPromiseを許可しないため、Descriptionのマイグレーションはあとでやる

export async function GET(context: APIContext) {
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: posts.map((post) => {
      return {
        title: post.data.title,
        pubDate: post.data.date,
        link: `/post/${post.slug}/`,
        categories: post.data.tags
      }
    })
  })
}
