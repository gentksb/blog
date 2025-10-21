import rss from "@astrojs/rss"
import sanitizeHtml from "sanitize-html"
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "~/consts"
import { timeOrderPosts as posts } from "@lib/timeOrderPosts"
import { experimental_AstroContainer as AstroContainer } from "astro/container"
import reactRenderer from "@astrojs/react/server.js"
import mdxRenderer from "@astrojs/mdx/server.js"

const container = await AstroContainer.create()
container.addServerRenderer({ name: "mdx", renderer: mdxRenderer })
container.addServerRenderer({ name: "react", renderer: reactRenderer })
container.addClientRenderer({
  name: "@astrojs/react",
  entrypoint: "@astrojs/react/client.js"
})

export async function GET() {
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: await Promise.all(
      posts.map(async (post) => {
        const { Content } = await post.render()
        const contentString = await container.renderToString(Content)
        return {
          title: `${post.data.title}`,
          pubDate: post.data.date,
          link: `/post/${post.slug}/`,
          categories: post.data.tags,
          description: `<![CDATA[${sanitizeHtml(contentString, {
            allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"]
          })}]]>`
        }
      })
    )
  })
}
