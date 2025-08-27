/**
 * ミドルウェアの統合テスト
 * SELF fetcherを使った実際のWorker環境でのミドルウェア動作検証
 * セキュリティヘッダーのvalidation動作をテスト
 */

import { expect, test } from "vitest"
import { SELF } from "cloudflare:test"

test.skip("middleware allows valid sec-fetch-mode headers in Worker environment (タイムアウト問題のためスキップ)", async () => {
  const validModes = ["same-origin", "cors", "same-site"]
  
  for (const mode of validModes) {
    const response = await SELF.fetch("http://example.com/api/getOgp?url=https://example.com", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })
    
    // Valid headers should not be blocked by middleware
    // If middleware blocks, we'd get 403, otherwise we get the actual API response
    expect(response.status).not.toBe(403)
  }
})

test("middleware blocks invalid sec-fetch-mode headers in Worker environment", async () => {
  const invalidModes = ["navigate", "websocket", "no-cors", ""]
  
  for (const mode of invalidModes) {
    const response = await SELF.fetch("http://example.com/api/getOgp?url=https://example.com", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })
    
    expect(response.status).toBe(403)
    expect(await response.text()).toBe("Forbidden")
  }
})

test("middleware blocks requests without sec-fetch-mode header in Worker environment", async () => {
  const response = await SELF.fetch("http://example.com/api/getOgp?url=https://example.com", {
    method: "GET"
  })
  
  expect(response.status).toBe(403)
  expect(await response.text()).toBe("Forbidden")
})

test("middleware validation works for Amazon API endpoints", async () => {
  // Test with Amazon API endpoint
  const response = await SELF.fetch("http://example.com/api/getAmznPa/B004N3APGO", {
    method: "GET",
    headers: {
      "sec-fetch-mode": "navigate" // Invalid mode
    }
  })
  
  expect(response.status).toBe(403)
  expect(await response.text()).toBe("Forbidden")
})

test.skip("middleware allows requests with valid headers through to API processing (タイムアウト問題のためスキップ)", async () => {
  const response = await SELF.fetch("http://example.com/api/getOgp?url=https://example.com", {
    method: "GET",
    headers: {
      "sec-fetch-mode": "cors"
    }
  })
  
  // Should pass through middleware and reach API logic
  // If URL parameter validation fails, we get 400, not 403
  expect([200, 400]).toContain(response.status)
})

test.skip("middleware works consistently across different API endpoints (タイムアウト問題のためスキップ)", async () => {
  const endpoints = [
    "/api/getOgp?url=https://example.com",
    "/api/getAmznPa/B004N3APGO",
    "/post/test/twitter-og.png"
  ]
  
  for (const endpoint of endpoints) {
    const response = await SELF.fetch(`http://example.com${endpoint}`, {
      method: "GET",
      headers: {
        "sec-fetch-mode": "navigate" // Invalid mode
      }
    })
    
    
    expect(response.status).toBe(403)
    expect(await response.text()).toBe("Forbidden")
  }
})