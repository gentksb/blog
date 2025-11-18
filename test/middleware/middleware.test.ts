/**
 * ミドルウェアの統合テスト
 * SELF fetcherを使った実際のWorker環境でのミドルウェア動作検証
 * セキュリティヘッダーのvalidation動作をテスト
 */

import { expect, test } from "vitest"
import { SELF } from "cloudflare:test"

test("middleware allows valid sec-fetch-mode headers in Worker environment", async () => {
  // MDN準拠: navigate以外は全て許可
  const validModes = [
    "same-origin",
    "cors",
    "same-site",
    "websocket",
    "no-cors",
    ""
  ]

  for (const mode of validModes) {
    const response = await SELF.fetch("http://example.com/api/healthcheck", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })

    // Valid headers should not be blocked by middleware
    expect(response.status).toBe(200)
    expect(await response.text()).toBe("OK")
  }
})

test("middleware blocks invalid sec-fetch-mode headers in Worker environment", async () => {
  // MDN準拠: navigateのみブロック
  const invalidModes = ["navigate"]

  for (const mode of invalidModes) {
    const response = await SELF.fetch("http://example.com/api/healthcheck", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })

    expect(response.status).toBe(403)
    expect(await response.text()).toBe("Forbidden")
  }
})

test("middleware allows requests without sec-fetch-mode header in Worker environment", async () => {
  const response = await SELF.fetch("http://example.com/api/healthcheck", {
    method: "GET"
  })

  // MDN準拠: ヘッダーがない場合は許可（古いブラウザ対応）
  // ヘルスチェックエンドポイントに到達できることを確認
  expect(response.status).toBe(200)
  expect(await response.text()).toBe("OK")
})

test("middleware validation works for healthcheck endpoint", async () => {
  // Test with healthcheck endpoint
  const response = await SELF.fetch("http://example.com/api/healthcheck", {
    method: "GET",
    headers: {
      "sec-fetch-mode": "navigate" // Invalid mode
    }
  })

  expect(response.status).toBe(403)
  expect(await response.text()).toBe("Forbidden")
})

test("middleware allows requests with valid headers through to API processing", async () => {
  const response = await SELF.fetch("http://example.com/api/healthcheck", {
    method: "GET",
    headers: {
      "sec-fetch-mode": "cors"
    }
  })

  // Should pass through middleware and reach healthcheck endpoint
  expect(response.status).toBe(200)
  expect(await response.text()).toBe("OK")
})

test("middleware works consistently for healthcheck endpoint with various valid modes", async () => {
  const validModes = [
    "cors",
    "same-origin",
    "same-site",
    "websocket",
    "no-cors",
    ""
  ]

  for (const mode of validModes) {
    const response = await SELF.fetch("http://example.com/api/healthcheck", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe("OK")
  }
})
