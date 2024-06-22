import React from "react"
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api"

export const ogImage = (title: string, coverSrc?: string) =>
  new ImageResponse(
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
          <div tw="flex w-full px-12 my-auto text-white text-7xl font-bold text-center">
            {title}
          </div>
        </div>
        <div tw="flex text-gray-100 text-2xl justify-end absolute bottom-0 right-0">
          <img src="https://blog.gensobunya.net/image/logo.jpg" tw="h-[2rem]" />
          幻想サイクル
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
