import type { OgpData } from "@type/ogpData-type"
import type { CreatorsApiItemsResponse } from "../../src/server/services/getAmazonProductInfo"
import { expect, test } from "vitest"
import {
  createAmazonResponse,
  createForbiddenResponse,
  createInvalidAsinResponse,
  createMethodNotAllowedResponse,
  createMissingUrlParameterResponse,
  createOgImageErrorResponse,
  createOgpFetchErrorResponse,
  createOgpResponse
} from "../../src/server/domain/transformers"

// === Amazon API用変換関数のテスト ===

test("Amazon response creation", () => {
  const mockProductData: CreatorsApiItemsResponse = {
    itemsResult: {
      items: [
        {
          asin: "B004N3APGO",
          detailPageURL: "https://www.amazon.com/dp/B004N3APGO",
          itemInfo: {
            title: {
              displayValue: "Test Product",
              label: "Title",
              locale: "en_US"
            }
          },
          images: {
            primary: {
              small: {
                url: "https://example.com/small.jpg",
                height: 75,
                width: 75
              },
              medium: {
                url: "https://example.com/medium.jpg",
                height: 160,
                width: 160
              },
              large: {
                url: "https://example.com/large.jpg",
                height: 500,
                width: 500
              }
            }
          }
        }
      ]
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
  expect(response.headers.get("content-type")).toBe(
    "application/json; charset=UTF-8"
  )
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")

  // Check if the response body is correct JSON
  response.json().then((data) => {
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
  expect(response.headers.get("content-type")).toBe(
    "application/json; charset=UTF-8"
  )
  await expect(response.text()).resolves.toBe(ogpDataString)
})

test("Missing URL parameter response creation", () => {
  const response = createMissingUrlParameterResponse()

  expect(response.status).toBe(400)
  expect(response.headers.get("content-type")).toBe("application/json")

  response.json().then((data) => {
    expect(data).toEqual({ error: "URL parameter is required" })
  })
})

test("OGP fetch error response creation", () => {
  const response = createOgpFetchErrorResponse()

  expect(response.status).toBe(500)
  expect(response.headers.get("content-type")).toBe("application/json")

  response.json().then((data) => {
    expect(data).toEqual({ error: "Failed to fetch OGP data" })
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
  response.text().then((text) => {
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
  const amazonResponse = createAmazonResponse({} as CreatorsApiItemsResponse)
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
