import { expect, test } from "vitest"
import { SELF } from "cloudflare:test"

test.skip("Amazon API E2E - 無効なASINで400エラーを返す (Slackログによるタイムアウトのためスキップ)", async () => {
  // 無効なASINでリクエスト
  const response = await SELF.fetch("http://example.com/api/getAmznPa/INVALID", {
    headers: {
      "sec-fetch-mode": "cors"
    }
  })

  expect(response.status).toBe(400)
  expect(await response.text()).toContain("Invalid ASIN format")
})

test("Amazon API E2E - 存在しないパスで404を返す", async () => {
  const response = await SELF.fetch("http://example.com/api/nonexistent", {
    headers: {
      "sec-fetch-mode": "cors"
    }
  })

  expect(response.status).toBe(404)
})

test("Amazon API E2E - POSTメソッドで405エラーを返す", async () => {
  const response = await SELF.fetch(
    "http://example.com/api/getAmznPa/B004N3APGO",
    {
      method: "POST",
      headers: {
        "sec-fetch-mode": "cors"
      }
    }
  )

  expect(response.status).toBe(405)
  expect(await response.text()).toContain("Method Not Allowed")
})

// 注意: 実際のPA-API呼び出しは環境変数が必要で、レート制限もあるため
// 本番では別途CI/CD環境で実行することを想定
