/**
 * 新しいhandler関数の統合テスト
 * 依存性注入を使ったテスタブルな設計のテスト
 * モックに依存せず、実際の依存性を使った統合テスト
 */

import { expect, test, vi } from "vitest"
import { env } from "cloudflare:test"
import { createOgpHandler } from "../../functions/src/ogpApi"
import { createOgImageHandler } from "../../functions/src/ogImageHandler"
import {
  createOgpAdapter,
  createOgpKVCacheAdapter,
  createOgpSlackLoggerAdapter,
  createOgpFetcherAdapter
} from "../../functions/src/adapters/ogpAdapter"
import {
  createOgImageAdapter,
  createOgImageSlackLoggerAdapter,
  createAssetFetcherAdapter,
  createHtmlParserAdapter,
  createImageGeneratorAdapter
} from "../../functions/src/adapters/ogImageAdapter"
import {
  createSecurityMiddleware
} from "../../functions/src/middleware"
import type { OgpData } from "@type/ogpData-type"

// Mock external dependencies to keep tests isolated
vi.mock("../../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

vi.mock("../../functions/src/getOgpMetaData", () => ({
  getOgpMetaData: vi.fn().mockResolvedValue({
    ogpTitle: "Test OGP Title",
    ogpImageUrl: "https://example.com/test.jpg",
    ogpDescription: "Test Description",
    ogpSiteName: "Test Site",
    pageurl: "https://example.com/test",
    ok: true
  })
}))

vi.mock("../../functions/src/ogImage", () => ({
  ogImage: vi.fn().mockResolvedValue(
    new Response(new ArrayBuffer(1000), {
      headers: { "content-type": "image/png" }
    })
  )
}))

// === OGP Handler統合テスト ===

test("createOgpHandler with dependency injection works correctly", async () => {
  // Create real KV cache adapter
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  const logger = createOgpSlackLoggerAdapter("https://hooks.slack.com/test")
  const fetcher = createOgpFetcherAdapter()
  
  const adapter = createOgpAdapter({
    cache,
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger,
    fetcher
  })

  const handler = createOgpHandler(adapter)

  // Test valid request
  const validRequest = new Request("https://example.com/api/getOgp?url=https://example.com/test")
  const response = await handler(validRequest)

  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json; charset=UTF-8")
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")

  // Verify response data
  const data = await response.json() as OgpData
  expect(data.ogpTitle).toBe("Test OGP Title")
  expect(data.pageurl).toBe("https://example.com/test")
})

test("createOgpHandler handles missing URL parameter", async () => {
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  const logger = createOgpSlackLoggerAdapter("https://hooks.slack.com/test")
  const fetcher = createOgpFetcherAdapter()
  
  const adapter = createOgpAdapter({
    cache,
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger,
    fetcher
  })

  const handler = createOgpHandler(adapter)

  const invalidRequest = new Request("https://example.com/api/getOgp")
  const response = await handler(invalidRequest)

  expect(response.status).toBe(400)
  
  const errorData = await response.json() as { error: string }
  expect(errorData.error).toBe('URL parameter is required')
})

test("createOgpHandler handles non-GET methods", async () => {
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  const logger = createOgpSlackLoggerAdapter("https://hooks.slack.com/test")
  const fetcher = createOgpFetcherAdapter()
  
  const adapter = createOgpAdapter({
    cache,
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger,
    fetcher
  })

  const handler = createOgpHandler(adapter)

  const postRequest = new Request("https://example.com/api/getOgp?url=https://example.com/test", {
    method: "POST"
  })
  const response = await handler(postRequest)

  expect(response.status).toBe(405)
  expect(await response.text()).toBe("Method Not Allowed")
})

// === OG Image Handler統合テスト ===

test("createOgImageHandler with dependency injection works correctly", async () => {
  const logger = createOgImageSlackLoggerAdapter("https://hooks.slack.com/test")
  
  // Mock assets fetcher that returns HTML with OG metadata
  const mockAssets = {
    fetch: vi.fn().mockResolvedValue(new Response(`
      <html>
        <head>
          <meta property="og:title" content="Test Article | 幻想サイクル">
          <meta property="og:image" content="https://example.com/article-image.jpg">
        </head>
      </html>
    `))
  } as unknown as Fetcher

  const assetFetcher = createAssetFetcherAdapter(mockAssets)
  const htmlParser = createHtmlParserAdapter()
  const imageGenerator = createImageGeneratorAdapter()
  
  const adapter = createOgImageAdapter({
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger,
    assetFetcher,
    htmlParser,
    imageGenerator
  })

  const handler = createOgImageHandler(adapter)

  const imageRequest = new Request("https://example.com/post/test-article/twitter-og.png")
  const response = await handler(imageRequest)

  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("image/png")
})

test("createOgImageHandler handles non-twitter-og.png requests", async () => {
  const logger = createOgImageSlackLoggerAdapter("https://hooks.slack.com/test")
  const assetFetcher = createAssetFetcherAdapter({} as Fetcher)
  const htmlParser = createHtmlParserAdapter()
  const imageGenerator = createImageGeneratorAdapter()
  
  const adapter = createOgImageAdapter({
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger,
    assetFetcher,
    htmlParser,
    imageGenerator
  })

  const handler = createOgImageHandler(adapter)

  const nonImageRequest = new Request("https://example.com/post/test-article")
  
  await expect(handler(nonImageRequest)).rejects.toThrow("Not a Twitter OG image request")
})

test("createOgImageHandler handles non-GET methods", async () => {
  const logger = createOgImageSlackLoggerAdapter("https://hooks.slack.com/test")
  const assetFetcher = createAssetFetcherAdapter({} as Fetcher)
  const htmlParser = createHtmlParserAdapter()
  const imageGenerator = createImageGeneratorAdapter()
  
  const adapter = createOgImageAdapter({
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger,
    assetFetcher,
    htmlParser,
    imageGenerator
  })

  const handler = createOgImageHandler(adapter)

  const postRequest = new Request("https://example.com/post/test-article/twitter-og.png", {
    method: "POST"
  })
  const response = await handler(postRequest)

  expect(response.status).toBe(405)
  expect(await response.text()).toBe("Method Not Allowed")
})

// === Security Middleware統合テスト ===

test("createSecurityMiddleware allows valid sec-fetch-mode headers", () => {
  const middleware = createSecurityMiddleware()

  const validModes = ["same-origin", "cors", "same-site"]

  validModes.forEach(mode => {
    const request = new Request("https://example.com/api/test", {
      headers: {
        "sec-fetch-mode": mode
      }
    })

    const result = middleware(request)
    expect(result).toBeNull() // null means request should proceed
  })
})

test("createSecurityMiddleware blocks invalid sec-fetch-mode headers", () => {
  const middleware = createSecurityMiddleware()

  const invalidModes = ["navigate", "websocket", "no-cors", ""]

  invalidModes.forEach(mode => {
    const request = new Request("https://example.com/api/test", {
      headers: {
        "sec-fetch-mode": mode
      }
    })

    const result = middleware(request)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
  })
})

test("createSecurityMiddleware blocks requests without sec-fetch-mode header", () => {
  const middleware = createSecurityMiddleware()

  const request = new Request("https://example.com/api/test")
  
  const result = middleware(request)
  expect(result).not.toBeNull()
  expect(result!.status).toBe(403)
  expect(result!.text()).resolves.toBe("Forbidden")
})

// === キャッシュ動作の統合テスト ===

test("OGP handler uses cache correctly", async () => {
  const testUrl = "https://cache-test.example.com/"
  const testKey = `ogp-cache-integration-test-${Date.now()}`
  
  // Clear potential existing data
  if (env.OGP_DATASTORE?.delete) {
    await env.OGP_DATASTORE.delete(testKey)
  }

  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  const logger = createOgpSlackLoggerAdapter("https://hooks.slack.com/test")
  const fetcher = createOgpFetcherAdapter()
  
  const adapter = createOgpAdapter({
    cache,
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger,
    fetcher
  })

  // Mock the cache to use our test key
  const originalCacheGet = adapter.getCached
  const originalCacheSet = adapter.cacheResult
  
  adapter.getCached = (_url: string) => originalCacheGet.call(adapter, testKey)
  adapter.cacheResult = (_url: string, data: OgpData) => originalCacheSet.call(adapter, testKey, data)

  const handler = createOgpHandler(adapter)

  // First request - should fetch and cache
  const firstRequest = new Request(`https://example.com/api/getOgp?url=${encodeURIComponent(testUrl)}`)
  const firstResponse = await handler(firstRequest)
  
  expect(firstResponse.status).toBe(200)
  const firstData = await firstResponse.json() as OgpData
  expect(firstData.ogpTitle).toBe("Test OGP Title")

  // Second request - should return from cache
  const secondRequest = new Request(`https://example.com/api/getOgp?url=${encodeURIComponent(testUrl)}`)
  const secondResponse = await handler(secondRequest)
  
  expect(secondResponse.status).toBe(200)
  const secondData = await secondResponse.json() as OgpData
  expect(secondData.ogpTitle).toBe(firstData.ogpTitle)

  // Cleanup
  if (env.OGP_DATASTORE?.delete) {
    await env.OGP_DATASTORE.delete(testKey)
  }
})