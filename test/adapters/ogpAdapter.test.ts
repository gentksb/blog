import { expect, test, vi } from "vitest"
import { env } from "cloudflare:test"
import {
  createOgpAdapter,
  createOgpKVCacheAdapter,
  createOgpSlackLoggerAdapter,
  createOgpFetcherAdapter,
  type OgpCacheAdapter,
  type OgpLoggerAdapter,
  type OgpFetcherAdapter
} from "../../functions/src/adapters/ogpAdapter"
import type { OgpData } from "@type/ogpData-type"

// Mock external dependencies for Slack logger and OGP fetcher
vi.mock("../../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

vi.mock("../../functions/src/getOgpMetaData", () => ({
  getOgpMetaData: vi.fn().mockResolvedValue({
    ogpTitle: "Test Title",
    ogpImageUrl: "https://example.com/image.jpg",
    ogpDescription: "Test Description",
    ogpSiteName: "Test Site",
    pageurl: "https://example.com/",
    ok: true
  })
}))

test("OGP KV cache adapter works correctly with real KV", async () => {
  // Use actual KV from test environment
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  
  if (!cache) {
    throw new Error("KV namespace not available in test environment")
  }

  const testKey = `test-ogp-key-${Date.now()}`
  const testData: OgpData = {
    ogpTitle: "Test Title",
    ogpImageUrl: "https://example.com/image.jpg",
    ogpDescription: "Test Description",
    ogpSiteName: "Test Site",
    pageurl: "https://example.com/",
    ok: true
  }

  // Test put operation
  await cache.put(testKey, testData, 3600)

  // Test get operation
  const retrievedData = await cache.get(testKey)
  expect(retrievedData).toEqual(testData)

  // Cleanup: delete test data
  if (env.OGP_DATASTORE?.delete) {
    await env.OGP_DATASTORE.delete(testKey)
  }
})

test("OGP KV cache adapter handles missing keys gracefully", async () => {
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  
  if (!cache) {
    throw new Error("KV namespace not available in test environment")
  }

  const nonExistentKey = `non-existent-ogp-${Date.now()}`
  
  // Should return null for non-existent keys
  const result = await cache.get(nonExistentKey)
  expect(result).toBeNull()
})

test("OGP KV cache adapter handles string data (backward compatibility)", async () => {
  const cache = createOgpKVCacheAdapter(env.OGP_DATASTORE)
  
  if (!cache) {
    throw new Error("KV namespace not available in test environment")
  }

  const testKey = `test-string-ogp-key-${Date.now()}`
  const testDataString = JSON.stringify({
    ogpTitle: "String Test Title",
    pageurl: "https://string.example.com/",
    ok: true
  })

  // Test put operation with string data
  await cache.put(testKey, testDataString, 3600)

  // Test get operation - should return as string
  const retrievedData = await cache.get(testKey)
  expect(typeof retrievedData).toBe("string")
  expect(retrievedData).toBe(testDataString)

  // Cleanup
  if (env.OGP_DATASTORE?.delete) {
    await env.OGP_DATASTORE.delete(testKey)
  }
})

test("OGP Slack logger adapter works correctly", async () => {
  const logger = createOgpSlackLoggerAdapter("https://hooks.slack.com/test")

  // The actual postLogToSlack is mocked, so this should not throw
  await expect(
    logger.logError("Test OGP error message", "https://test.com")
  ).resolves.toBeUndefined()
})

test("OGP fetcher adapter works correctly", async () => {
  const fetcher = createOgpFetcherAdapter()

  // The actual getOgpMetaData is mocked
  const result = await fetcher.fetchOgpData("https://example.com/")
  
  expect(result).toEqual({
    ogpTitle: "Test Title",
    ogpImageUrl: "https://example.com/image.jpg",
    ogpDescription: "Test Description",
    ogpSiteName: "Test Site",
    pageurl: "https://example.com/",
    ok: true
  })
})

test("OGP adapter integrates all dependencies correctly", async () => {
  const testUrl = "https://example.com/test"
  
  // Create mock dependencies
  const mockCache: OgpCacheAdapter = {
    get: vi.fn().mockResolvedValue(null),
    put: vi.fn().mockResolvedValue(undefined)
  }
  
  const mockLogger: OgpLoggerAdapter = {
    logError: vi.fn().mockResolvedValue(undefined)
  }
  
  const mockFetcher: OgpFetcherAdapter = {
    fetchOgpData: vi.fn().mockResolvedValue({
      ogpTitle: "Integration Test Title",
      pageurl: testUrl,
      ok: true
    })
  }
  
  const adapter = createOgpAdapter({
    cache: mockCache,
    config: { slackWebhookUrl: "https://hooks.slack.com/test" },
    logger: mockLogger,
    fetcher: mockFetcher
  })
  
  // Test cache miss scenario
  const cachedResult = await adapter.getCached(testUrl)
  expect(cachedResult).toBeNull()
  expect(mockCache.get).toHaveBeenCalledWith(testUrl)
  
  // Test fetching OGP data
  const ogpData = await adapter.getOgpData(testUrl)
  expect(ogpData.ogpTitle).toBe("Integration Test Title")
  expect(mockFetcher.fetchOgpData).toHaveBeenCalledWith(testUrl)
  
  // Test caching result
  await adapter.cacheResult(testUrl, ogpData)
  expect(mockCache.put).toHaveBeenCalledWith(testUrl, ogpData, 60 * 60 * 24 * 7)
  
  // Test error logging
  await adapter.logError("Test error", testUrl)
  expect(mockLogger.logError).toHaveBeenCalledWith("Test error", testUrl)
})