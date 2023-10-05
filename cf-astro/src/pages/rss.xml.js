import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts"

// TODO: 今のRSS配信内容を参照して中身を揃える

export async function get(context) {
  const posts = await getCollection("post")
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/post/${post.slug}/`
    }))
  })
}
