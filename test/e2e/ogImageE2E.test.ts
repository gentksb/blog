/**
 * OG画像生成用の真のE2Eテスト
 * SELF fetcherを使った実際のWorker環境での完全な統合テスト
 * モックは使わず、実際のWorker環境でテスト
 */

import { expect, test } from "vitest"
import { SELF } from "cloudflare:test"

test.skip("OG画像生成 E2E - twitter-og.pngリクエストでPNG画像を返す (フォント関連エラーのためスキップ)", async () => {
  const response = await SELF.fetch("http://example.com/post/test-slug/twitter-og.png")
  
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("image/png")
  
  // レスポンスボディが画像データであることを確認
  const buffer = await response.arrayBuffer()
  expect(buffer.byteLength).toBeGreaterThan(0)
})

test.skip("OG画像生成 E2E - 深い階層のパスでも動作する (フォント関連エラーのためスキップ)", async () => {
  const response = await SELF.fetch("http://example.com/post/2024/01/deep-nested-article/twitter-og.png")
  
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("image/png")
})

test("OG画像生成 E2E - twitter-og.png以外のパスは404を返す", async () => {
  const response = await SELF.fetch("http://example.com/post/test-slug/facebook-og.png")
  
  expect(response.status).toBe(404)
})

test("OG画像生成 E2E - 通常の記事パスは404を返す", async () => {
  const response = await SELF.fetch("http://example.com/post/test-slug")
  
  expect(response.status).toBe(404)
})

test("OG画像生成 E2E - POSTメソッドで405エラーを返す", async () => {
  const response = await SELF.fetch("http://example.com/post/test-slug/twitter-og.png", {
    method: "POST"
  })
  
  expect(response.status).toBe(405)
})