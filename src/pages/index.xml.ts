export const prerender = true

import rss from "@astrojs/rss"
import { timeOrderPosts as posts } from "@lib/timeOrderPosts"
import { extractDescription } from "@lib/extractDescription"
import { slugFromId } from "@lib/postSlug"
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "~/consts"

export async function GET() {
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: posts.map((post) => ({
      title: `${post.data.title}`,
      pubDate: post.data.date,
      link: `/post/${slugFromId(post.id)}/`,
      categories: post.data.tags,
      description: extractDescription(post.body ?? "", 200)
    }))
  })
}
