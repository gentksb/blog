import { sanitizeUrl } from "@braintree/sanitize-url"
import type { OgpData } from "@type/ogpData-type"

export const getOgpMetaData = async (queryUrl: string, _env: Env) => {
  const decodedUrl = decodeURIComponent(queryUrl)
  const safeUrl = sanitizeUrl(decodedUrl)
  console.log(`safeUrl: ${safeUrl}`)

  const responseBody = await parseOgpTags(safeUrl)

  return responseBody
}

const parseOgpTags = async (href: string): Promise<OgpData> => {
  const result: OgpData = {
    ogpTitle: undefined,
    ogpImageUrl: undefined,
    ogpDescription: undefined,
    ogpSiteName: undefined,
    pageurl: href,
    ok: false
  }

  try {
    // global_fetch_strictly_publicフラグにより統一されたfetchを使用
    const httpResponse = await fetch(href)

    console.log(`fetching ${href} is done`, httpResponse.status)

    if (!httpResponse.ok) {
      const result: OgpData = {
        ok: false,
        error: "Query url is not found or invalid."
      }
      return result
    }

    result.ok = true
    const rewriter = new HTMLRewriter()
    // rewriter.onしたハンドラーの順序性は保証されているが、解析先のWEBサイトにおいてmetaタグの後にtitleタグが来る保証
    // およびog:xxxとdescriptionのmetaタグ順序は保証されないため、titleとdescriptionはデータが無い場合の書き込み、ogで上書きされることで
    // 冪等性を担保している
    rewriter.on("meta", {
      element(element) {
        switch (element.getAttribute("property")) {
          case "og:title":
            result.ogpTitle = element.getAttribute("content")
            break
          case "og:description":
            result.ogpDescription = element.getAttribute("content")
            break
          case "og:image":
            result.ogpImageUrl = element.getAttribute("content")
            break
          case "og:site_name":
            result.ogpSiteName = element.getAttribute("content")
            break
          default:
            break
        }
      }
    })
    rewriter.on("title", {
      text(text) {
        if (!result.ogpTitle || "") {
          result.ogpTitle = text.text ?? ""
        }
      }
    })
    rewriter.on("meta", {
      element(element) {
        switch (element.getAttribute("name")) {
          case "description":
            if (!result.ogpDescription || "") {
              result.ogpDescription = element.getAttribute("content")
            }
            break
          default:
            break
        }
      }
    })

    await rewriter.transform(httpResponse).arrayBuffer()
    // transformではなく抽出だが、一度Streamを動かさないと機能しないため、arrayBuffer()を使っている
    return result
  } catch (error) {
    console.error(`Error on fetch: ${error}`)
    const result: OgpData = {
      ok: false,
      error: JSON.stringify(error)
    }
    return result
  }
}
