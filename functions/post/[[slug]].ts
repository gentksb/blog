import { ogImage } from "./src/ogImage"

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const imagePathSuffix = "/twitter-og.png"

  // アクセスURLの末尾が/twitter-og.pngでない場合は元のレスポンスを返す
  if (!context.request.url.endsWith(imagePathSuffix)) {
    return context.next()
  }

  // 記事のOGPタイトルとOGP画像のURLを取得
  const postMetaData = {
    title: "",
    imageUrl: ""
  }
  const rewriter = new HTMLRewriter()
  const response = await context.next()
  await rewriter
    .on("meta", {
      element(element) {
        switch (element.getAttribute("property")) {
          case "og:title":
            postMetaData.title = element.getAttribute("content") ?? ""
            break
          case "og:image":
            postMetaData.imageUrl = element.getAttribute("content") ?? ""
            break
          default:
            break
        }
      }
    })
    .transform(response)
    .arrayBuffer()

  const imageResponse = await ogImage(
    postMetaData.title,
    postMetaData.imageUrl
      ? postMetaData.imageUrl
      : "https://blog.gensobunya.net/image/logo.jpg"
  )

  return imageResponse
}
