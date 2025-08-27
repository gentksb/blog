import { expect, test, vi } from "vitest"
import { env } from "cloudflare:test"
import {
  createKVCacheAdapter,
  createSlackLoggerAdapter
} from "../../functions/src/adapters/amazonAdapter"
import { createMockAmazonResponse } from "../helpers/mockData"

// Mock external dependencies only for Slack logger
vi.mock("../../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

test("KV cache adapter works correctly with real KV", async () => {
  // Use actual KV from test environment instead of mocking
  const cache = createKVCacheAdapter(env.AMAZON_CACHE || env.OGP_DATASTORE)
  
  if (!cache) {
    throw new Error("KV namespace not available in test environment")
  }

  const testKey = `test-key-${Date.now()}`
  const testData = createMockAmazonResponse("TEST123")

  // Test put operation
  await cache.put(testKey, testData, 3600)

  // Test get operation
  const retrievedData = await cache.get(testKey)
  expect(retrievedData).toEqual(testData)

  // Cleanup: delete test data
  if (env.AMAZON_CACHE?.delete) {
    await env.AMAZON_CACHE.delete(testKey)
  } else if (env.OGP_DATASTORE?.delete) {
    await env.OGP_DATASTORE.delete(testKey)
  }
})

test("KV cache adapter handles missing keys gracefully", async () => {
  const cache = createKVCacheAdapter(env.AMAZON_CACHE || env.OGP_DATASTORE)
  
  if (!cache) {
    throw new Error("KV namespace not available in test environment")
  }

  const nonExistentKey = `non-existent-${Date.now()}`
  
  // Should return null for non-existent keys
  const result = await cache.get(nonExistentKey)
  expect(result).toBeNull()
})

test("Slack logger adapter works correctly", async () => {
  const logger = createSlackLoggerAdapter("https://hooks.slack.com/test")

  // The actual postLogToSlack is mocked, so this should not throw
  await expect(
    logger.logError("Test message", "http://test.com")
  ).resolves.toBeUndefined()
})
