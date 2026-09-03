export const prerender = false

import { getEntry } from "astro:content"
import { env } from "cloudflare:workers"
import type { APIContext } from "astro"
import { postToMarkdown } from "@lib/postToMarkdown"
import { SITE_URL } from "~/consts"

export async function GET({ params, site }: APIContext) {
  const slug = params.slug

  if (!slug) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" }
    })
  }

  const entry = await getEntry("post", slug)

  if (!entry) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" }
    })
  }

  if (entry.body === undefined) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" }
    })
  }

  const siteUrl = site?.href ?? SITE_URL
  const partnerTag = env.PARTNER_TAG ?? ""

  const markdown = postToMarkdown({
    slug,
    title: entry.data.title,
    date: entry.data.date,
    tags: entry.data.tags,
    body: entry.body,
    siteUrl,
    partnerTag
  })

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  })
}
