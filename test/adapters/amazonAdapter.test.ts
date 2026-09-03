import { env } from "cloudflare:workers"
import { afterEach, expect, test, vi } from "vitest"
import {
  createKVCacheAdapter,
  createSlackLoggerAdapter
} from "../../src/server/adapters/amazonAdapter"
import { createMockAmazonResponse } from "../helpers/mockData"

// Mock external dependencies only for Slack logger
vi.mock("../../src/server/services/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

const writtenKeys: string[] = []

const trackKey = (key: string) => {
  writtenKeys.push(key)
  return key
}

afterEach(async () => {
  await Promise.all(writtenKeys.map((key) => env.PAAPI_DATASTORE.delete(key)))
  writtenKeys.length = 0
})

test("KV cache adapter works correctly with real KV", async () => {
  // Use actual KV from test environment instead of mocking
  const cache = createKVCacheAdapter(env.PAAPI_DATASTORE)

  if (!cache) {
    throw new Error("KV namespace not available in test environment")
  }

  const testKey = trackKey(`test-key-${Date.now()}`)
  const testData = createMockAmazonResponse("TEST123")

  // Test put operation
  await cache.put(testKey, testData, 3600)

  // Test get operation
  const retrievedData = await cache.get(testKey)
  expect(retrievedData).toEqual(testData)
})

test("KV cache adapter handles missing keys gracefully", async () => {
  const cache = createKVCacheAdapter(env.PAAPI_DATASTORE)

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
