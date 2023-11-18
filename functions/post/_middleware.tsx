import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api"
// eslint-disable-next-line
// @ts-ignore
interface Props {
  ogTitle: string
  ogImageSrc: string
}

// https://github.com/cloudflare/pages-plugins/blob/main/packages/vercel-og/functions/_middleware.ts
// 上記のロジックをほぼコピーして、サブセットフォントをGoogle fontsから手に入れて vercel/og に渡す処理を追加

function escapeRegex(string: string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")
}

export const onRequest: PagesFunction = async ({ request, next }) => {
  const imagePathSuffix = "/twitter-og.png"
  const options = {
    width: 1200,
    height: 675
  }
  const url = new URL(request.url)
  const componentProps: Props = {
    ogTitle: "",
    ogImageSrc: ""
  }
  const extractorsOn = {
    'meta[property="og:title"]': (componentProps) => ({
      element(element: HTMLMetaElement) {
        componentProps.ogTitle = element.getAttribute("content") ?? ""
      }
    }),
    'meta[property="og:image"]': (componentProps) => ({
      element(element: HTMLMetaElement) {
        componentProps.ogImageSrc = element.getAttribute("content") ?? ""
      }
    })
  }

  const match = url.pathname.match(`(.*)${escapeRegex(imagePathSuffix)}`)
  let htmlRewriter = new HTMLRewriter()

  if (match) {
    const props = {
      pathname: match[1]
    }
    const response = await next(match[1])
    for (const [selector, handlerGenerators] of Object.entries(extractorsOn)) {
      htmlRewriter = htmlRewriter.on(selector, handlerGenerators(props))
    }
    await htmlRewriter.transform(response).arrayBuffer()

    const makeComponents = (props: Props) => (
      <div
        tw="flex flex-col w-full h-full"
        style={{ fontFamily: "Noto Sans JP" }}
      >
        <div tw="flex w-full h-full">
          <img src={props.ogImageSrc} tw="w-full h-full object-cover" />
        </div>
        <div tw="absolute flex top-0 left-0 bg-black/70 w-full h-full"></div>
        <div tw="absolute flex h-full w-full">
          <div tw="flex w-full px-12 my-auto text-white text-7xl font-bold text-center">
            {props.ogTitle.replace(" | 幻想サイクル", "")}
          </div>
        </div>
        <div tw="flex text-gray-100 text-2xl justify-end absolute bottom-0 right-0">
          <img src="https://blog.gensobunya.net/image/logo.jpg" tw="h-[2rem]" />
          幻想サイクル
        </div>
      </div>
    )
    const makeFontData = async (props: string) => {
      const googleFontsCss = await (
        await fetch(
          `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@800&display=swap&text=${props}`
        )
      ).text()
      const resource = googleFontsCss.match(
        /src: url\((.+)\) format\('(opentype|truetype)'\)/
      )
      if (!resource) return null
      const res = await fetch(resource[1])
      return res.arrayBuffer()
    }

    return new ImageResponse(makeComponents(componentProps), {
      ...options,
      fonts: [
        {
          name: "Noto Sans JP",
          data: await makeFontData(componentProps.ogTitle),
          weight: 800,
          style: "normal"
        }
      ]
    })
  }
  // og:imageへのautoInjectはしないので、パスが一致しなかったらnext()を呼ぶ
  return next()
}
