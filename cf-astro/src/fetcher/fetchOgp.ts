import { sanitizeUrl } from "@braintree/sanitize-url"
import { HTMLRewriter } from "html-rewriter-wasm"

export interface ResType {
  ogpTitle?: string
  ogpImageUrl?: string
  ogpDescription?: string
  ogpSiteName?: string
  pageurl?: string
  ok: boolean
  error?: string
}

// https://zenn.dev/uyas/articles/0b7dcbb46d8031
class OGPParser {
  ogpTitle: string
  ogpDescription: string
  ogpImageUrl: string
  ogpSiteName: string

  constructor() {
    this.ogpTitle = ""
    this.ogpDescription = ""
    this.ogpImageUrl = ""
    this.ogpSiteName = ""
  }
  element(element: Element):void {
    switch (element.getAttribute("property")) {
      case "og:title":
        this.ogpTitle = element.getAttribute("content") ?? ""
        break
      case "og:description":
        this.ogpDescription = element.getAttribute("content") ?? ""
        break
      case "og:image":
        this.ogpImageUrl = element.getAttribute("content") ?? ""
        break
      case "og:site_name":
        this.ogpSiteName = element.getAttribute("content") ?? ""
        break
      default:
        break
    }
  }
}

export const fetchOgp = async (queryUrl: string) => {
  const decodedUrl = decodeURIComponent(queryUrl)
  const safeUrl = sanitizeUrl(decodedUrl)

  const responseBody = await getOgpDatas(safeUrl)

  return responseBody
}

const getOgpDatas = async (href: string): Promise<ResType> => {

  const result: ResType = {
    ogpTitle: "",
    ogpImageUrl: "",
    ogpDescription:"",
    ogpSiteName: "",
    pageurl: href,
    ok: true
  }

  try {
    const httpResponse = await fetch(href)
    if (!httpResponse.ok) {
      const result: ResType = {
        ok: false,
        error: "Query url is not found"
      }
      return result
    } else {
      const ogp = new OGPParser()

      const rewriter = new HTMLRewriter((outputChunk) => {})
      await rewriter.on("meta", {element(element){
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
      }})
      await rewriter.end()


      console.log(result)
      return result
    }
  } catch (error: any) {
    console.error(error)
    const result: ResType = {
      ok: false,
      error: JSON.stringify(error)
    }
    return result
  }
}
