import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api"

export const ogImage = async (title: string, coverSrc: string) => {
  try {
    console.log("OG Image generation started", { title, coverSrc })

    // https://github.com/vercel/satori/blob/main/playground/pages/api/font.ts
    const weight = 600
    const fontName = "Noto Sans JP"
    const subsetNotoSansJPUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&display=swap&text=${encodeURIComponent(title + "幻想サイクル")}`

    console.log("Fetching font CSS from:", subsetNotoSansJPUrl)
    const cssResponse = await fetch(subsetNotoSansJPUrl)
    if (!cssResponse.ok) {
      throw new Error(
        `Font CSS fetch failed: ${cssResponse.status} ${cssResponse.statusText}`
      )
    }
    const css = await cssResponse.text()
    console.log("Font CSS fetched successfully, length:", css.length)

    const resource = css.match(
      /src: url\((.+)\) format\('(opentype|truetype|woff2)'\)/
    )
    if (!resource) {
      console.error("Font resource not found in CSS:", css.substring(0, 500))
      throw new Error("Font resource URL not found in CSS")
    }

    const fontUrl = resource[1]
    console.log("Font URL extracted:", fontUrl)

    console.log("Fetching font data from:", fontUrl)
    const fontResponse = await fetch(fontUrl)
    if (!fontResponse.ok) {
      throw new Error(
        `Font data fetch failed: ${fontResponse.status} ${fontResponse.statusText}`
      )
    }
    const fontData = await fontResponse.arrayBuffer()
    console.log("Font data fetched successfully, size:", fontData.byteLength)

    console.log("Starting ImageResponse generation")

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%"
          }}
        >
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <img
              src={coverSrc}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              width: "100%",
              height: "100%"
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              display: "flex",
              height: "100%",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                padding: "0 4rem",
                margin: "auto 0",
                color: "white",
                fontSize: "72px",
                lineHeight: "72px",
                textAlign: "center",
                textWrap: "pretty",
                fontFamily: fontName
              }}
            >
              {title}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              color: "#d1d5db",
              fontSize: "24px",
              justifyContent: "flex-end",
              position: "absolute",
              bottom: 0,
              right: 0,
              fontFamily: fontName
            }}
          >
            <img
              src="https://blog.gensobunya.net/image/logo.jpg"
              style={{ height: "2rem" }}
            />
            幻想サイクル
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: fontName,
            data: fontData,
            weight: weight,
            style: "normal"
          }
        ]
      }
    )
  } catch (error) {
    console.error("OG Image generation failed:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      title,
      coverSrc
    })

    // フォールバック: coverSrcの画像をそのまま返す
    if (coverSrc) {
      try {
        console.log("Attempting fallback: returning coverSrc image directly")
        const imageResponse = await fetch(coverSrc)
        if (imageResponse.ok) {
          console.log("Fallback successful: coverSrc image fetched")
          return new Response(imageResponse.body, {
            headers: {
              "Content-Type":
                imageResponse.headers.get("Content-Type") || "image/jpeg",
              "Cache-Control": "public, max-age=31536000"
            }
          })
        } else {
          console.warn(
            `Fallback failed: coverSrc fetch failed with status ${imageResponse.status}`
          )
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError)
      }
    }

    throw error
  }
}
