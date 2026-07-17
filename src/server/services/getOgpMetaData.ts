import { sanitizeUrl } from "@braintree/sanitize-url"
import type { OgpData } from "@type/ogpData-type"
import {
  buildProductPrice,
  extractPriceFromJsonLd
} from "../domain/productPrice"

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

    // 商品価格の構造化データ収集用バッファ
    let jsonLdBuffer = ""
    let metaPriceAmount: string | null = null
    let metaPriceCurrency: string | null = null

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
          // EC サイトが出力する OGP 拡張の価格メタタグ（Shopify 等）
          case "product:price:amount":
          case "og:price:amount":
            metaPriceAmount ??= element.getAttribute("content")
            break
          case "product:price:currency":
          case "og:price:currency":
            metaPriceCurrency ??= element.getAttribute("content")
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

    // JSON-LD の中身はテキストチャンクとして分割されて届くため、
    // lastInTextNode までバッファに蓄積して script 要素単位で抽出する
    rewriter.on('script[type="application/ld+json"]', {
      text(text) {
        // 価格が確定したら以降のブロックはバッファリングごと省略する
        if (result.productPrice) {
          return
        }
        jsonLdBuffer += text.text
        if (text.lastInTextNode) {
          // "Product" を含まないブロック（BreadcrumbList 等）は JSON.parse を省略
          if (jsonLdBuffer.includes("Product")) {
            const price = extractPriceFromJsonLd(jsonLdBuffer)
            if (price) {
              result.productPrice = price
            }
          }
          jsonLdBuffer = ""
        }
      }
    })

    await rewriter.transform(httpResponse).arrayBuffer()
    // transformではなく抽出だが、一度Streamを動かさないと機能しないため、arrayBuffer()を使っている

    // JSON-LD (schema.org Product) から価格が取れなかった場合のみ価格メタタグにフォールバック
    if (!result.productPrice) {
      const metaPrice = buildProductPrice(metaPriceAmount, metaPriceCurrency)
      if (metaPrice) {
        result.productPrice = metaPrice
      }
    }

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
