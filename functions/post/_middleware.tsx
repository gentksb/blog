import React from "react"
import vercelOGPagesPlugin from "@cloudflare/pages-plugin-vercel-og"

interface Props {
  ogTitle: string
}

export const onRequest = vercelOGPagesPlugin<Props>({
  imagePathSuffix: "/twitter-og.png",
  component: ({ ogTitle, pathname }) => {
    return (
      <div style={{ display: "flex" }}>
        {ogTitle}
        <br />
        {pathname}
      </div>
    )
  },
  extractors: {
    on: {
      'meta[property="og:title"]': (props) => ({
        element(element) {
          props.ogTitle = element.getAttribute("content")
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
