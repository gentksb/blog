import { expect, test, vi } from "vitest"
import { env } from "cloudflare:test"
import { getOgpMetaData } from "../../functions/src/services/getOgpMetaData"
import { normalLinkUrl, normalLinkDataExpectedResponse } from "../fixtures/testData"

const encodedUrl = encodeURIComponent(normalLinkUrl)

// cloudflare:testから提供されるenvをモック
const mockEnv = {
  ...env,
  ASSETS: {
    fetch: vi.fn().mockResolvedValue(new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>幻想サイクル</title>
        <meta property="og:title" content="幻想サイクル">
        <meta property="og:image" content="https://blog.gensobunya.net/image/logo.jpg">
        <meta property="og:description" content="AJOCC ME1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです">
        <meta property="og:site_name" content="幻想サイクル">
      </head>
      <body></body>
      </html>
    `, { status: 200, headers: { "content-type": "text/html" } })),
    connect: vi.fn()
  }
} as unknown as Env

test("URIエンコードされたURLからOGPデータを取得する", async () => {
  const res = await getOgpMetaData(encodedUrl, mockEnv)
  expect(res).deep.equal(normalLinkDataExpectedResponse)
})
