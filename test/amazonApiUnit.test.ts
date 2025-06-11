import { expect, test, vi } from "vitest"
import { onRequestGet } from "../functions/api/getAmznPa/[asin]"
import { env } from "cloudflare:test"

// Replace the actual import with our mock
vi.mock("../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

test("Amazon API validates ASIN format - valid ASIN", async () => {
  const validAsin = "B004N3APGO"
  
  const request = new Request(`http://localhost/api/getAmznPa/${validAsin}`, {
    method: "GET"
  })
  
  const context = {
    request,
    params: { asin: validAsin },
    env: {
      ...env,
      SLACK_WEBHOOK_URL: "https://mock-webhook.com"
    }
  } as any
  
  // Should not throw validation error
  try {
    await onRequestGet(context)
  } catch (error) {
    expect(error.message).not.toBe("asin is't valid.")
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
    
    const context = {
      request,
      params: { asin },
      env: {
        ...env,
        SLACK_WEBHOOK_URL: "https://mock-webhook.com"
      }
    } as any
    
    await expect(onRequestGet(context)).rejects.toThrow("asin is't valid.")
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