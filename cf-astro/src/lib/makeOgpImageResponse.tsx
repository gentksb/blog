import type { CollectionEntry } from "astro:content"
import { ImageResponse } from "@vercel/og"
import { readFileSync } from "fs"

interface Props {
  title: string
  image?: CollectionEntry<"post">["data"]["cover"]
  slug?: CollectionEntry<"post">["slug"]
}

const asResponse = (imageResponse: ImageResponse) => {
  /**
   * ImageResponse's constructor returns Response instance.
   * @see {import("@vercel/og").ImageResponse}
   */
  // https://t28.dev/blog/output-ogp-image-for-astro-pages/
  return imageResponse as Response
}

export const makeBlogPostOgpImageResponse = async ({
  title,
  image,
  slug
}: Props) => {
  const faviconBase64 = readFileSync(
    new URL("../../public/favicon.svg", import.meta.url),
    { encoding: "base64" }
  )
  const backgroungImageBase64 = readFileSync(
    new URL(`../../src/content/post/${slug}/cover.jpg`, import.meta.url),
    {
      encoding: "base64"
    }
  )
  const faviconDataUrl = `data:image/svg+xml;base64,${faviconBase64}`
  const backgroundImageDataUrl = `data:image/jpeg;base64,${backgroungImageBase64}`

  return asResponse(
    new ImageResponse(
      (
        <div
          lang="ja-JP"
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
            // backgroundImage: backgroundImageDataUrl
          }}
        >
          <div style={{ display: "flex" }}>{title}</div>
          <div style={{ display: "flex", lineHeight: 1.2 }}>
            <img src={faviconDataUrl} height={100} />
          </div>
        </div>
      ),
      {}
    )
  )
}
