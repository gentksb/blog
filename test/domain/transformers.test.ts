import { expect, test } from "vitest"
import {
  createAmazonResponse,
  createInvalidAsinResponse,
  createOgpResponse,
  createMissingUrlParameterResponse,
  createOgpFetchErrorResponse,
  createForbiddenResponse,
  createOgImageErrorResponse,
  createMethodNotAllowedResponse
} from "../../functions/src/domain/transformers"
import type { AmazonItemsResponse } from "amazon-paapi"
import type { OgpData } from "@type/ogpData-type"

// === Amazon API用変換関数のテスト ===

test("Amazon response creation", () => {
  const mockProductData: AmazonItemsResponse = {
    ItemsResult: {
      Items: [{
        ASIN: "B004N3APGO",
        DetailPageURL: "https://www.amazon.com/dp/B004N3APGO",
        ItemInfo: {
          Title: {
            DisplayValue: "Test Product",
            Label: "Title",
            Locale: "en_US"
          }
        },
        Images: {
          Primary: {
            Small: {
              URL: "https://example.com/small.jpg",
              Height: 75,
              Width: 75
            },
            Medium: {
              URL: "https://example.com/medium.jpg",
              Height: 160,
              Width: 160
            },
            Large: {
              URL: "https://example.com/large.jpg",
              Height: 500,
              Width: 500
            }
          }
        },
        Offers: {
          Summaries: [],
          Listings: []
        }
      }]
    }
  }

  const response = createAmazonResponse(mockProductData)
  
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")
  expect(response.headers.get("x-robots-tag")).toBe("noindex")
})

test("Invalid ASIN response creation", async () => {
  const response = createInvalidAsinResponse("INVALID")
  
  expect(response.status).toBe(400)
  await expect(response.text()).resolves.toBe("Invalid ASIN format: INVALID")
})

test("Invalid ASIN response with null ASIN", async () => {
  const response = createInvalidAsinResponse(null)
  
  expect(response.status).toBe(400)
  await expect(response.text()).resolves.toBe("Invalid ASIN format: null")
})

// === OGP API用変換関数のテスト ===

test("OGP response creation with OgpData object", () => {
  const ogpData: OgpData = {
    ogpTitle: "Test Title",
    ogpImageUrl: "https://example.com/image.jpg",
    ogpDescription: "Test Description",
    ogpSiteName: "Test Site",
    pageurl: "https://example.com/",
    ok: true
  }

  const response = createOgpResponse(ogpData)
  
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json; charset=UTF-8")
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")
  
  // Check if the response body is correct JSON
  response.json().then(data => {
    expect(data).toEqual(ogpData)
  })
})

test("OGP response creation with string data", async () => {
  const ogpDataString = JSON.stringify({
    ogpTitle: "String Test Title",
    pageurl: "https://example.com/",
    ok: true
  })

  const response = createOgpResponse(ogpDataString)
  
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json; charset=UTF-8")
  await expect(response.text()).resolves.toBe(ogpDataString)
})

test("Missing URL parameter response creation", () => {
  const response = createMissingUrlParameterResponse()
  
  expect(response.status).toBe(400)
  expect(response.headers.get("content-type")).toBe("application/json")
  
  response.json().then(data => {
    expect(data).toEqual({ error: 'URL parameter is required' })
  })
})

test("OGP fetch error response creation", () => {
  const response = createOgpFetchErrorResponse()
  
  expect(response.status).toBe(500)
  expect(response.headers.get("content-type")).toBe("application/json")
  
  response.json().then(data => {
    expect(data).toEqual({ error: 'Failed to fetch OGP data' })
  })
})

// === セキュリティミドルウェア用変換関数のテスト ===

test("Forbidden response creation", async () => {
  const response = createForbiddenResponse()
  
  expect(response.status).toBe(403)
  await expect(response.text()).resolves.toBe("Forbidden")
})

// === OG画像生成用変換関数のテスト ===

test("OG image error response creation", () => {
  const response = createOgImageErrorResponse()
  
  expect(response.status).toBe(500)
  expect(response.statusText).toBe("Internal Server Error")
  
  // Response body should be null
  response.text().then(text => {
    expect(text).toBe("")
  })
})

// === 共通エラーレスポンステスト ===

test("Method Not Allowed response creation", async () => {
  const response = createMethodNotAllowedResponse()
  
  expect(response.status).toBe(405)
  await expect(response.text()).resolves.toBe("Method Not Allowed")
})

// === レスポンスヘッダーの一貫性テスト ===

test("Response headers consistency", () => {
  const amazonResponse = createAmazonResponse({} as AmazonItemsResponse)
  const ogpResponse = createOgpResponse({ ok: true } as OgpData)
  
  // Both should have cache-control headers
  expect(amazonResponse.headers.has("cache-control")).toBe(true)
  expect(ogpResponse.headers.has("cache-control")).toBe(true)
  
  // Both should have content-type headers
  expect(amazonResponse.headers.has("content-type")).toBe(true)
  expect(ogpResponse.headers.has("content-type")).toBe(true)
  
  // Both should have noindex for robots
  expect(amazonResponse.headers.get("x-robots-tag")).toBe("noindex")
  expect(ogpResponse.headers.get("X-Robots-Tag")).toBe("noindex")
})