import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api"

export const ogImage = async (title: string, coverSrc: string) => {
  // https://github.com/vercel/satori/blob/main/playground/pages/api/font.ts
  const weight = 600
  const fontName = "Noto Sans JP"
  const subsetNotoSansJPUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&display=swap&text=${title + "幻想サイクル"}`
  const css = await (await fetch(subsetNotoSansJPUrl)).text()
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype|woff2)'\)/
  )
  if (!resource) {
    throw new Error("font resource not found")
  }
  const fontData = await (await fetch(resource[1])).arrayBuffer()
  console.log(resource)

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
}
