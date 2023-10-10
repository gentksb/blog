import type { CollectionEntry } from "astro:content"
import { ImageResponse } from "@vercel/og"
import type React from "react"

interface Props {
  title: string
  image?: CollectionEntry<"post">["data"]["cover"]
}

const asResponse = (imageResponse: ImageResponse) => {
  /**
   * ImageResponse's constructor returns Response instance.
   * @see {import("@vercel/og").ImageResponse}
   */
  // https://t28.dev/blog/output-ogp-image-for-astro-pages/
  return imageResponse as Response
}

export const makeBlogPostOgpImageResponse = async ({ title, image }: Props) => {
  return asResponse(new ImageResponse(<div lang="ja-JP">{title}</div>, {}))
}
