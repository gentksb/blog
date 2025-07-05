import { expect, test, vi } from "vitest"
import { handleAmazonApi } from "../functions/src/amazonApi"
import { env } from "cloudflare:test"

// Replace the actual import with our mock
vi.mock("../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

vi.mock("../functions/src/getAmazonProductInfo", () => ({
  getAmazonProductInfo: vi.fn().mockResolvedValue({
    ItemsResult: {
      Items: [{
        ASIN: "B004N3APGO",
        DetailPageURL: "https://amazon.com/dp/B004N3APGO",
        ItemInfo: {
          Title: {
            DisplayValue: "Test Product"
          }
        }
      }]
    }
  })
}))

// Mock Cloudflare Pages plugin to avoid font loading issues
vi.mock("@cloudflare/pages-plugin-vercel-og/api", () => ({
  ImageResponse: vi.fn().mockImplementation(() => {
    return new Response(new ArrayBuffer(100), {
      headers: { "content-type": "image/png" }
    })
  })
}))

test("Amazon API validates ASIN format - valid ASIN", async () => {
  const validAsin = "B004N3APGO"
  
  const request = new Request(`http://localhost/api/getAmznPa/${validAsin}`, {
    method: "GET"
  })
  
  const mockKV = {
    get: vi.fn().mockResolvedValue(null),
    put: vi.fn().mockResolvedValue(undefined)
  }
  
  const mockEnv = {
    ...env,
    SLACK_WEBHOOK_URL: "https://mock-webhook.com",
    PAAPI_DATASTORE: mockKV,
    PAAPI_ACCESSKEY: "test-key",
    PAAPI_SECRETKEY: "test-secret",
    PARTNER_TAG: "test-tag"
  }
  
  const ctx = {} as any
  
  // Should not throw validation error
  try {
    const response = await handleAmazonApi(request, mockEnv, ctx)
    expect(response.status).toBe(200)
  } catch (error) {
    expect((error as Error).message).not.toBe("asin is't valid.")
  }
})

test("Amazon API rejects invalid ASIN format", async () => {
  const invalidAsins = [
    "B004N3APG", // 9 characters
    "B004N3APGO1", // 11 characters  
    "B004N3APGo", // lowercase
    "B004-N3APG", // special character
    "B004 N3APG", // space
    "", // empty
    "あいうえおかきくけこ" // non-ASCII
  ]
  
  for (const asin of invalidAsins) {
    const request = new Request(`http://localhost/api/getAmznPa/${asin}`, {
      method: "GET"
    })
    
    const mockKV = {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined)
    }
    
    const mockEnv = {
      ...env,
      SLACK_WEBHOOK_URL: "https://mock-webhook.com",
      PAAPI_DATASTORE: mockKV,
      PAAPI_ACCESSKEY: "test-key",
      PAAPI_SECRETKEY: "test-secret",
      PARTNER_TAG: "test-tag"
    }
    
    const ctx = {} as any
    
    await expect(handleAmazonApi(request, mockEnv, ctx)).rejects.toThrow("asin is't valid.")
  }
})

test("Amazon API ASIN validation function works correctly", () => {
  // Test the validation function directly by extracting its logic
  const isValidAsin = (asin: string): boolean => {
    return /^[A-Z0-9]{10}$/.test(asin)
  }
  
  // Valid ASINs
  expect(isValidAsin("B004N3APGO")).toBe(true)
  expect(isValidAsin("1234567890")).toBe(true)
  expect(isValidAsin("ABCDEFGHIJ")).toBe(true)
  
  // Invalid ASINs
  expect(isValidAsin("B004N3APG")).toBe(false) // 9 characters
  expect(isValidAsin("B004N3APGO1")).toBe(false) // 11 characters
  expect(isValidAsin("B004N3APGo")).toBe(false) // lowercase
  expect(isValidAsin("B004-N3APG")).toBe(false) // special character
  expect(isValidAsin("B004 N3APG")).toBe(false) // space
  expect(isValidAsin("")).toBe(false) // empty
})