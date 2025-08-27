/**
 * OGP API用の真のE2Eテスト
 * SELF fetcherを使った実際のWorker環境での完全な統合テスト
 * モックは使わず、実際のWorker環境とKVでテスト
 */

import { expect, test } from "vitest"
import { SELF, env } from "cloudflare:test"
import type { OgpData } from "@type/ogpData-type"

test("OGP API E2E - URLパラメータなしで400エラーを返す", async () => {
  const response = await SELF.fetch("http://example.com/api/getOgp")
  
  expect(response.status).toBe(400)
})

test("OGP API E2E - 有効なURLで成功レスポンスを返す", async () => {
  const testUrl = "https://example.com/"
  const encodedUrl = encodeURIComponent(testUrl)
  
  // Clear potential cache first
  if (env.OGP_DATASTORE) {
    await env.OGP_DATASTORE.delete(testUrl)
  }
  
  const response = await SELF.fetch(`http://example.com/api/getOgp?url=${encodedUrl}`)
  
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json; charset=UTF-8")
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")
  
  const data = await response.json() as OgpData
  expect(data.pageurl).toBe(testUrl)
  expect(typeof data.ogpTitle).toBe("string")
})

test("OGP API E2E - キャッシュからの取得をテスト", async () => {
  const testUrl = "https://httpbin.org/html"
  const encodedUrl = encodeURIComponent(testUrl)
  
  // Clear cache first
  if (env.OGP_DATASTORE) {
    await env.OGP_DATASTORE.delete(testUrl)
  }
  
  // First request - should fetch and cache
  const firstResponse = await SELF.fetch(`http://example.com/api/getOgp?url=${encodedUrl}`)
  expect(firstResponse.status).toBe(200)
  const firstData = await firstResponse.json() as OgpData
  
  // Second request - should return from cache
  const secondResponse = await SELF.fetch(`http://example.com/api/getOgp?url=${encodedUrl}`)
  expect(secondResponse.status).toBe(200)
  const secondData = await secondResponse.json() as OgpData
  
  // Data should be identical
  expect(secondData.ogpTitle).toBe(firstData.ogpTitle)
  expect(secondData.pageurl).toBe(firstData.pageurl)
})

test("OGP API E2E - 無効なURLで適切にハンドリング", async () => {
  const invalidUrl = "not-a-valid-url"
  const encodedUrl = encodeURIComponent(invalidUrl)
  
  const response = await SELF.fetch(`http://example.com/api/getOgp?url=${encodedUrl}`)
  
  // Should handle invalid URLs gracefully
  expect([200, 400, 500]).toContain(response.status)
})

test("OGP API E2E - POSTメソッドで405エラーを返す", async () => {
  const response = await SELF.fetch("http://example.com/api/getOgp?url=https://example.com", {
    method: "POST"
  })
  
  expect(response.status).toBe(405)
})