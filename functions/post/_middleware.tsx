import React from "react"
import vercelOGPagesPlugin from "@cloudflare/pages-plugin-vercel-og"

interface Props {
  ogTitle: string
  ogImageSrc: string
}

export const onRequest = vercelOGPagesPlugin<Props>({
  imagePathSuffix: "/twitter-og.png",
  component: ({ ogTitle, ogImageSrc }) => {
    // テキストが真ん中にそろわないので、要調整
    // わかりやすくテキストにバックグラウンドカラーを設定
    return (
      <div tw="flex flex-col w-full h-full">
        <div tw="flex w-full h-full">
          <img src={ogImageSrc} tw="w-full h-full object-cover" />
        </div>
        <div tw="absolute top-0 left-0 bg-black/60 w-full h-full "></div>
        <div tw="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 text-4xl text-center bg-gray-100">
          {ogTitle}
        </div>
        <div tw="flex text-gray-100 text-2xl justify-end absolute bottom-0 right-0">
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
    height: 630
  },
  autoInject: {
    openGraph: false
    // twitter:imageにだけ手動でパスを挿入する
  }
})
