import { describe, expect, test } from "vitest"
import {
  buildProductPrice,
  extractPriceFromJsonLd,
  formatProductPrice,
  normalizeCurrency,
  parsePriceAmount
} from "../../src/server/domain/productPrice"

describe("parsePriceAmount", () => {
  test("数値はそのまま返す", () => {
    expect(parsePriceAmount(1980)).toBe(1980)
    expect(parsePriceAmount(49.99)).toBe(49.99)
    expect(parsePriceAmount(0)).toBe(0)
  })

  test("カンマ・通貨記号入りの文字列を数値に正規化する", () => {
    expect(parsePriceAmount("1980")).toBe(1980)
    expect(parsePriceAmount("1,980")).toBe(1980)
    expect(parsePriceAmount("¥12,800")).toBe(12800)
    expect(parsePriceAmount("$49.99")).toBe(49.99)
  })

  test("解釈できない値は undefined を返す", () => {
    expect(parsePriceAmount("")).toBeUndefined()
    expect(parsePriceAmount("価格未定")).toBeUndefined()
    expect(parsePriceAmount(-100)).toBeUndefined()
    expect(parsePriceAmount(NaN)).toBeUndefined()
    expect(parsePriceAmount(null)).toBeUndefined()
    expect(parsePriceAmount(undefined)).toBeUndefined()
    expect(parsePriceAmount({})).toBeUndefined()
  })
})

describe("normalizeCurrency", () => {
  test("ISO 4217 形式に正規化する", () => {
    expect(normalizeCurrency("JPY")).toBe("JPY")
    expect(normalizeCurrency("jpy")).toBe("JPY")
    expect(normalizeCurrency(" usd ")).toBe("USD")
  })

  test("形式外の値は undefined を返す", () => {
    expect(normalizeCurrency("円")).toBeUndefined()
    expect(normalizeCurrency("YEN!")).toBeUndefined()
    expect(normalizeCurrency("")).toBeUndefined()
    expect(normalizeCurrency(123)).toBeUndefined()
    expect(normalizeCurrency(null)).toBeUndefined()
  })
})

describe("buildProductPrice", () => {
  test("価格と通貨が揃っていれば ProductPrice を返す", () => {
    expect(buildProductPrice("1,980", "jpy")).toEqual({
      amount: 1980,
      currency: "JPY"
    })
  })

  test("どちらかが欠けている場合は undefined を返す", () => {
    expect(buildProductPrice("1980", null)).toBeUndefined()
    expect(buildProductPrice(null, "JPY")).toBeUndefined()
    expect(buildProductPrice("不明", "JPY")).toBeUndefined()
  })
})

describe("extractPriceFromJsonLd", () => {
  test("Product + Offer から価格を抽出する", () => {
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "サイクルコンピューター",
      offers: {
        "@type": "Offer",
        price: "24800",
        priceCurrency: "JPY"
      }
    })
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 24800,
      currency: "JPY"
    })
  })

  test("@type が配列の Product にも対応する", () => {
    const jsonLd = JSON.stringify({
      "@type": ["Product", "IndividualProduct"],
      offers: { "@type": "Offer", price: 5000, priceCurrency: "JPY" }
    })
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 5000,
      currency: "JPY"
    })
  })

  test("@graph 内の Product から価格を抽出する", () => {
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "BreadcrumbList", itemListElement: [] },
        {
          "@type": "Product",
          offers: { "@type": "Offer", price: 12800, priceCurrency: "JPY" }
        }
      ]
    })
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 12800,
      currency: "JPY"
    })
  })

  test("トップレベルが配列でも Product を見つける", () => {
    const jsonLd = JSON.stringify([
      { "@type": "WebSite", name: "example" },
      {
        "@type": "Product",
        offers: { "@type": "Offer", price: "980", priceCurrency: "JPY" }
      }
    ])
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 980,
      currency: "JPY"
    })
  })

  test("AggregateOffer は lowPrice を優先する", () => {
    const jsonLd = JSON.stringify({
      "@type": "Product",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "9800",
        highPrice: "12800",
        priceCurrency: "JPY"
      }
    })
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 9800,
      currency: "JPY"
    })
  })

  test("offers が配列の場合は最初の有効な価格を使う", () => {
    const jsonLd = JSON.stringify({
      "@type": "Product",
      offers: [
        { "@type": "Offer", availability: "InStock" },
        { "@type": "Offer", price: "3300", priceCurrency: "JPY" }
      ]
    })
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 3300,
      currency: "JPY"
    })
  })

  test("AggregateOffer にネストされた Offer から価格を抽出する", () => {
    const jsonLd = JSON.stringify({
      "@type": "Product",
      offers: {
        "@type": "AggregateOffer",
        offerCount: 2,
        offers: [{ "@type": "Offer", price: "4980", priceCurrency: "JPY" }]
      }
    })
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 4980,
      currency: "JPY"
    })
  })

  test("priceSpecification にフォールバックする", () => {
    const jsonLd = JSON.stringify({
      "@type": "Product",
      offers: {
        "@type": "Offer",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "2680",
          priceCurrency: "JPY"
        }
      }
    })
    expect(extractPriceFromJsonLd(jsonLd)).toEqual({
      amount: 2680,
      currency: "JPY"
    })
  })

  test("Product が無い JSON-LD は undefined を返す", () => {
    const jsonLd = JSON.stringify({
      "@type": "Article",
      headline: "レビュー記事"
    })
    expect(extractPriceFromJsonLd(jsonLd)).toBeUndefined()
  })

  test("通貨が無い Offer は undefined を返す", () => {
    const jsonLd = JSON.stringify({
      "@type": "Product",
      offers: { "@type": "Offer", price: "1980" }
    })
    expect(extractPriceFromJsonLd(jsonLd)).toBeUndefined()
  })

  test("不正な JSON は undefined を返す", () => {
    expect(extractPriceFromJsonLd("{invalid json")).toBeUndefined()
    expect(extractPriceFromJsonLd("")).toBeUndefined()
  })
})

describe("formatProductPrice", () => {
  test("JPY は日本円表記に整形する", () => {
    expect(formatProductPrice({ amount: 12800, currency: "JPY" })).toBe(
      "￥12,800"
    )
  })

  test("外貨も通貨表記に整形する", () => {
    expect(formatProductPrice({ amount: 49.99, currency: "USD" })).toMatch(
      /49\.99/
    )
  })

  test("未知だが形式上有効な通貨コードは Intl がコード表記で整形する", () => {
    // normalizeCurrency を通過した3文字コードは well-formed なので Intl は例外を出さない
    const formatted = formatProductPrice({ amount: 100, currency: "ZZZ" })
    expect(formatted).toContain("100")
  })
})
