import { describe, expect, test } from "vitest"
import {
  buildProductPrice,
  extractPriceFromJsonLd
} from "../../src/server/domain/productPrice"

// parsePriceAmount / normalizeCurrency は buildProductPrice 経由で検証する
describe("buildProductPrice", () => {
  test.each([
    {
      amount: "¥12,800",
      currency: "jpy",
      expected: { amount: 12800, currency: "JPY" }
    },
    {
      amount: "$49.99",
      currency: " usd ",
      expected: { amount: 49.99, currency: "USD" }
    },
    {
      amount: 1980,
      currency: "JPY",
      expected: { amount: 1980, currency: "JPY" }
    },
    { amount: "価格未定", currency: "JPY", expected: undefined },
    { amount: -100, currency: "JPY", expected: undefined },
    { amount: "1980", currency: "円", expected: undefined },
    { amount: null, currency: "JPY", expected: undefined },
    { amount: "1980", currency: null, expected: undefined }
  ])("($amount, $currency) → $expected", ({ amount, currency, expected }) => {
    expect(buildProductPrice(amount, currency)).toEqual(expected)
  })
})

describe("extractPriceFromJsonLd", () => {
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

  test("通貨が無い Offer は undefined を返す", () => {
    const jsonLd = JSON.stringify({
      "@type": "Product",
      offers: { "@type": "Offer", price: "1980" }
    })
    expect(extractPriceFromJsonLd(jsonLd)).toBeUndefined()
  })
})
