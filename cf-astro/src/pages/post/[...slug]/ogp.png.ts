import { getCollection, getEntry } from "astro:content"
import type { APIRoute, GetStaticPaths } from "astro"
import { makeBlogPostOgpImageResponse } from "../../../lib/makeOgpImageResponse"

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("post")
  // ファイル名ではなくディレクトリ名にSlugを割り当てているので、/をつける
  return posts.map((post) => ({ params: { slug: `/${post.slug}` } }))
}

export const GET: APIRoute = async ({ params }) => {
  if (!params.slug) {
    throw new Error("No slug provided")
  } else {
    const post = await getEntry("post", params.slug)

    return await makeBlogPostOgpImageResponse({
      title: post?.data.title ?? "no title",
      image: post?.data.cover
    })
  }
}
