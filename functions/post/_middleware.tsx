import React from "react"
import vercelOGPagesPlugin from "@cloudflare/pages-plugin-vercel-og"

interface Props {
  ogTitle: string
  ogImageSrc: string
}

export const onRequest = vercelOGPagesPlugin<Props>({
  imagePathSuffix: "/twitter-og.png",
  component: ({ ogTitle, ogImageSrc }) => {
    const rawTitle = ogTitle.replace(" | 幻想サイクル", "")

    return (
      <div tw="flex flex-col w-full h-full">
        <div tw="flex w-full h-full">
          <img src={ogImageSrc} tw="w-full h-full object-cover" />
        </div>
        <div tw="absolute top-0 left-0 bg-black/70 w-full h-full "></div>
        <div tw="absolute flex h-full w-full">
          <div tw="w-full px-12 ">{rawTitle}</div>
        </div>
        <div tw="w-full my-auto px-12 text-white text-7xl font-bold text-center">
          <img src="https://blog.gensobunya.net/image/logo.jpg" tw="h-[2rem]" />
          幻想サイクル
        </div>
      </div>
    )
  },
  extractors: {
    on: {
      'meta[property="og:title"]': (props) => ({
        element(element) {
          props.ogTitle = element.getAttribute("content")
        }
      }),
      'meta[property="og:image"]': (props) => ({
        element(element) {
          props.ogImageSrc = element.getAttribute("content")
        }
      })
    }
  },
  options: {
    width: 1200,
    height: 675
  },
  autoInject: {
    openGraph: false
    // twitter:imageにだけ手動でパスを挿入する
  }
})
