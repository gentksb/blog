import { env } from "cloudflare:workers"
import { Buffer } from "node:buffer"
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api"

function detectImageFormat(buffer: Buffer): string {
  const uint8Array = new Uint8Array(buffer)

  // PNG: 89 50 4E 47
  if (
    uint8Array[0] === 0x89 &&
    uint8Array[1] === 0x50 &&
    uint8Array[2] === 0x4e &&
    uint8Array[3] === 0x47
  ) {
    return "image/png"
  }

  // JPEG: FF D8 FF
  if (
    uint8Array[0] === 0xff &&
    uint8Array[1] === 0xd8 &&
    uint8Array[2] === 0xff
  ) {
    return "image/jpeg"
  }

  // WebP: RIFF ... WEBP
  if (
    uint8Array[0] === 0x52 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    uint8Array[3] === 0x46
  ) {
    if (
      uint8Array[8] === 0x57 &&
      uint8Array[9] === 0x45 &&
      uint8Array[10] === 0x42 &&
      uint8Array[11] === 0x50
    ) {
      return "image/webp"
    }
  }

  // GIF: GIF8
  if (
    uint8Array[0] === 0x47 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    uint8Array[3] === 0x38
  ) {
    return "image/gif"
  }

  return "image/png" // デフォルトをPNGに変更（ImageResponseでより安全）
}

async function fetchImageAssetAsBase64(imageUrl: string): Promise<string> {
  console.log("Fetching image from:", imageUrl)
  const response = await env.ASSETS.fetch(imageUrl)
  if (!response.ok) {
    throw new Error(
      `Image fetch failed: ${response.status} ${response.statusText}`
    )
  }

  const arrayBuffer = await response.arrayBuffer()
  const declaredContentType = response.headers.get("content-type")

  // メモリ使用量チェック
  if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
    console.warn(
      `Large image detected: ${arrayBuffer.byteLength} bytes for ${imageUrl}`
    )
  }

  try {
    const buffer = Buffer.from(arrayBuffer)

    // 実際のファイル形式を検出
    const detectedContentType = detectImageFormat(buffer)

    // Content-Typeが宣言されているものと異なる場合は警告
    if (declaredContentType && declaredContentType !== detectedContentType) {
      console.warn(
        `Content-Type mismatch for ${imageUrl}: declared=${declaredContentType}, detected=${detectedContentType}`
      )
    }

    const contentType = detectedContentType
    const base64String = buffer.toString("base64")
    const dataUrl = `data:${contentType};base64,${base64String}`

    console.log(
      `Image processed: ${imageUrl}, format: ${contentType}, size: ${arrayBuffer.byteLength}`
    )
    return dataUrl
  } catch (error) {
    console.error("Image processing failed:", error)
    throw new Error(
      `Image processing failed for ${imageUrl}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

async function fetchFontData(title: string) {
  const weight = 600
  const fontName = "Noto Sans JP"
  const subsetNotoSansJPUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&display=swap&text=${encodeURIComponent(`${title}幻想サイクル`)}`

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

  return { fontData, fontName, weight }
}

async function createImageResponse(
  title: string,
  coverBase64: string,
  logoBase64: string,
  fontData: ArrayBuffer,
  fontName: string,
  weight: number
) {
  console.log("Starting ImageResponse generation")

  const imageResponse = new ImageResponse(
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
            src={coverBase64}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            width={1200}
            height={630}
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
        />
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
          <img src={logoBase64} alt="" style={{ height: "2rem" }} />
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

  console.log("ImageResponse generation completed successfully")
  return imageResponse
}

async function createFallbackResponse(coverSrc: string) {
  if (!coverSrc) {
    return null
  }

  console.log("Attempting fallback: returning coverSrc image directly")
  const imageResponse = await fetch(coverSrc)

  if (!imageResponse.ok) {
    console.warn(
      `Fallback failed: coverSrc fetch failed with status ${imageResponse.status}`
    )
    return null
  }

  console.log("Fallback successful: coverSrc image fetched")
  return new Response(imageResponse.body, {
    headers: {
      "Content-Type": imageResponse.headers.get("Content-Type") || "image/jpg",
      "Cache-Control": "public, max-age=31536000"
    }
  })
}

export const ogImage = async (
  title: string,
  coverSrc: string,
  currentHost?: string
) => {
  console.log("OG Image generation started", { title, coverSrc })

  try {
    // 並行してフォントデータ、カバー画像、ロゴ画像を取得
    const [fontResult, coverBase64, logoBase64] = await Promise.all([
      fetchFontData(title),
      fetchImageAssetAsBase64(coverSrc),
      fetchImageAssetAsBase64(
        currentHost
          ? `${currentHost}/image/logo.jpg`
          : "https://blog.gensobunya.net/image/logo.jpg"
      )
    ])

    const { fontData, fontName, weight } = fontResult

    return await createImageResponse(
      title,
      coverBase64,
      logoBase64,
      fontData,
      fontName,
      weight
    )
  } catch (error) {
    console.error("OG Image generation failed:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      title,
      coverSrc
    })

    try {
      const fallbackResponse = await createFallbackResponse(coverSrc)
      if (fallbackResponse) {
        return fallbackResponse
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError)
    }

    throw error
  }
}
