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
  element(element: Element) {
    console.log(`Incoming element: ${element.tagName}`)
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

export const onRequest: PagesFunction = async (context) => {
  const { searchParams } = new URL(context.request.url)
  const targetUrl = searchParams.get("url")

  const responseBody = await getOgpDatas(targetUrl)

  return new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  })
}

const getOgpDatas = async (url: string): Promise<ResType> => {
  const href = decodeURIComponent(url)

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
      new HTMLRewriter().on("meta", ogp).transform(httpResponse)

      const result: ResType = {
        ogpTitle: ogp.ogpTitle,
        ogpImageUrl: ogp.ogpImageUrl,
        ogpDescription: ogp.ogpDescription,
        ogpSiteName: ogp.ogpSiteName,
        pageurl: href,
        ok: true
      }
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
