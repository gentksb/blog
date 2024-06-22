import { sanitizeUrl } from "@braintree/sanitize-url"
import { type OgpData } from "@type/ogpData-type"

export const fetchOgp = async (queryUrl: string) => {
  const decodedUrl = decodeURIComponent(queryUrl)
  const safeUrl = sanitizeUrl(decodedUrl)

  const responseBody = await getOgpDatas(safeUrl)

  return responseBody
}

const getOgpDatas = async (href: string): Promise<OgpData> => {
  const result: OgpData = {
    ogpTitle: "",
    ogpImageUrl: "",
    ogpDescription: "",
    ogpSiteName: "",
    pageurl: href,
    ok: false
  }

  try {
    const httpResponse = await fetch(href)

    if (!httpResponse.ok) {
      const result: OgpData = {
        ok: false,
        error: "Query url is not found or invalid."
      }
      return result
    } else {
      result.ok = true
      const rewriter = new HTMLRewriter()
      rewriter
        .on("meta", {
          element(element) {
            switch (element.getAttribute("property")) {
              case "og:title":
                result.ogpTitle = element.getAttribute("content") ?? ""
                break
              case "og:description":
                result.ogpDescription = element.getAttribute("content") ?? ""
                break
              case "og:image":
                result.ogpImageUrl = element.getAttribute("content") ?? ""
                break
              case "og:site_name":
                result.ogpSiteName = element.getAttribute("content") ?? ""
                break
              default:
                break
            }
          }
        })
        .transform(httpResponse)
      // transformではなく抽出だが、一度Streamを動かさないと機能しないため、transformを使っている
      return result
    }
  } catch (error) {
    console.error(`Error on fetch: ${error}`)
    const result: OgpData = {
      ok: false,
      error: JSON.stringify(error)
    }
    return result
  }
}
