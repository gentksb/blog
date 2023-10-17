import { sanitizeUrl } from "@braintree/sanitize-url"
import { HTMLRewriter } from "html-rewriter-wasm"
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
    const encoder = new TextEncoder()

    if (!httpResponse.ok) {
      const result: OgpData = {
        ok: false,
        error: "Query url is not found"
      }
      return result
    } else {
      result.ok = true
      const rewriter = new HTMLRewriter((outputChunk) => {})
      await rewriter.on("meta", {
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
      await rewriter.write(encoder.encode(await httpResponse.text()))
      await rewriter.end()

      // console.log(result)
      return result
    }
  } catch (error: any) {
    console.error(error)
    const result: OgpData = {
      ok: false,
      error: JSON.stringify(error)
    }
    return result
  }
}
