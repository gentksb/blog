import rss from "@astrojs/rss"
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "~/consts"
import { timeOrderPosts as posts } from "@lib/timeOrderPosts"

// render()しないとexcerptを生成できないが、items内はPromiseを許可しないため、Descriptionのマイグレーションはあとでやる

export async function GET() {
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
