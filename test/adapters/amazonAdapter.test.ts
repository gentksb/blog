import { expect, test, vi } from "vitest"
import { 
  createKVCacheAdapter,
  createSlackLoggerAdapter,
  type CacheAdapter,
  type LoggerAdapter
} from "../../functions/src/adapters/amazonAdapter"
import { createMockAmazonResponse } from "../helpers/mockData"

// Mock external dependencies only for Slack logger
vi.mock("../../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

test("KV cache adapter works correctly", async () => {
  const mockKV = {
    get: vi.fn().mockResolvedValue({ test: "data" }),
    put: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
    list: vi.fn().mockResolvedValue({ keys: [], list_complete: true }),
    getWithMetadata: vi.fn().mockResolvedValue({ value: null, metadata: null })
  } as unknown as KVNamespace
  
  const cache = createKVCacheAdapter(mockKV)
  
  await cache.get("test-key")
  expect(mockKV.get).toHaveBeenCalledWith("test-key", "json")
  
  const testData = createMockAmazonResponse("TEST123")
  await cache.put("test-key", testData, 3600)
  expect(mockKV.put).toHaveBeenCalledWith("test-key", JSON.stringify(testData), {
    expirationTtl: 3600
  })
})

test("Slack logger adapter works correctly", async () => {
  const logger = createSlackLoggerAdapter("https://hooks.slack.com/test")
  
  // The actual postLogToSlack is mocked, so this should not throw
  await expect(logger.logError("Test message", "http://test.com")).resolves.toBeUndefined()
})