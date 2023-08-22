import { JSDOM } from "jsdom"

export const onRequest: PagesFunction = (context) => {
  const { searchParams } = new URL(context.request.url)
  const targetUrl = searchParams.get("url")

  return new Response(targetUrl)
}

// {
//   try {
//     const getHtmlDocument = async (url: string) => {
//       const httpResponse = await fetch(url)
//       const html = await httpResponse.text()
//       const jsdom = new JSDOM(html)
//       return jsdom.window.document
//     }
//     const document = await getHtmlDocument(ogpTargetUrl)
//     result.pageurl = decodeURI(data.url) // 通常のOGPは渡されたURLをそのままセットする
//     result.title =
//       document
//         .querySelector("meta[property='og:title']")
//         ?.getAttribute("content") ??
//       document.querySelector("meta[name='title']")?.getAttribute("content") ??
//       document.title ??
//       ""
//     result.imageUrl =
//       document
//         .querySelector("meta[property='og:image']")
//         ?.getAttribute("content") ?? ""
//     result.description =
//       document
//         .querySelector("meta[property='og:description']")
//         ?.getAttribute("content") ??
//       document
//         .querySelector("meta[name='description']")
//         ?.getAttribute("content") ??
//       ""
//     result.siteName =
//       document
//         .querySelector("meta[property='og:site_name']")
//         ?.getAttribute("content") ?? urlDomain

//     const siteIconPath =
//       document.querySelector("[type='image/x-icon']")?.getAttribute("href") ||
//       "/favicon.ico"
//     result.ogpIcon = siteIconPath.includes("//")
//       ? siteIconPath
//       : siteIconPath.charAt(0) === "/"
//       ? `${urlProtocol}//${urlDomain}${siteIconPath}`
//       : `${urlProtocol}//${urlDomain}/${siteIconPath}` // 絶対パスに変換

//     console.log(result)
//     cache.set(data.url, result)

//     return result
//   } catch (error: any) {
//     console.error(error)
//     console.error("INPUT: ", data)
//     throw new functions.https.HttpsError(
//       "internal",
//       "Webpage data parse failed"
//     )
//   }
// }
