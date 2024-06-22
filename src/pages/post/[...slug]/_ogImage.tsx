import React from "react"
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api"

export const ogImage = async (title: string, coverSrc?: string) => {
  // https://github.com/vercel/satori/blob/main/playground/pages/api/font.ts
  const weight = 600
  const fontName = "Noto Sans JP"
  const subsetNotoSansJPUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&display=swap&text=${title}`
  const css = await (await fetch(subsetNotoSansJPUrl)).text()
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype|woff2)'\)/
  )
  if (!resource) {
    throw new Error("font resource not found")
  }
  console.log(resource[1])
  const fontData = await (await fetch(resource[1])).arrayBuffer()

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full">
        <div tw="flex w-full h-full">
          <img
            src={"https://blog.gensobunya.net/image/logo.jpg"}
            tw="w-full h-full object-cover"
          />
        </div>
        <div tw="absolute flex top-0 left-0 bg-black/70 w-full h-full"></div>
        <div tw="absolute flex h-full w-full">
          <div
            tw="flex w-full px-12 my-auto text-white text-7xl text-center"
            style={{ fontFamily: fontName }}
          >
            {title}
          </div>
        </div>
        <div
          tw="flex text-gray-100 text-2xl justify-end absolute bottom-0 right-0"
          style={{ fontFamily: fontName }}
        >
          <img src="https://blog.gensobunya.net/image/logo.jpg" tw="h-[2rem]" />
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
