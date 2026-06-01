import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { getOgpMetaData } from "../../src/server/services/getOgpMetaData"
import { createMockEnv } from "../helpers/mockData"
import {
  normalLinkDataExpectedResponse,
  normalLinkOgpHtml,
  normalLinkUrl
} from "../fixtures/testData"

// getOgpMetaData は内部でグローバル fetch を直接呼び出すため、テストでは fetch をスタブして
// 制御された HTML を返す。これにより本番ドメイン (blog.gensobunya.net) への実ネットワーク
// アクセスを排除し、Cloudflare の bot 対策やサイト内容の変化に左右されない安定したテストにする。
// 検証対象は HTMLRewriter による OGP タグの抽出ロジックそのものである。

const env = createMockEnv()
const encodedUrl = encodeURIComponent(normalLinkUrl)

/**
 * fetch をスタブして任意の HTML / ステータスを返すヘルパー
 */
const stubFetch = (body: string, init?: ResponseInit) => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(body, {
      status: 200,
      headers: { "content-type": "text/html" },
      ...init
    })
  )
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("getOgpMetaData", () => {
  test("URI エンコードされた URL をデコードして OGP データを取得する", async () => {
    const fetchMock = stubFetch(normalLinkOgpHtml)

    const res = await getOgpMetaData(encodedUrl, env)

    // デコード済みの URL で fetch されること
    expect(fetchMock).toHaveBeenCalledWith(normalLinkUrl)
    expect(res).deep.equal(normalLinkDataExpectedResponse)
  })

  test("og:title が無い場合は title タグにフォールバックする", async () => {
    stubFetch(`<!DOCTYPE html>
<html>
<head>
  <title>タイトルタグの値</title>
  <meta property="og:description" content="説明">
  <meta property="og:image" content="https://example.com/image.jpg">
</head>
<body></body>
</html>`)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ok).toBe(true)
    expect(res.ogpTitle).toBe("タイトルタグの値")
  })

  test("og:description が無い場合は meta[name=description] にフォールバックする", async () => {
    stubFetch(`<!DOCTYPE html>
<html>
<head>
  <title>タイトル</title>
  <meta name="description" content="meta description の値">
</head>
<body></body>
</html>`)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ok).toBe(true)
    expect(res.ogpDescription).toBe("meta description の値")
  })

  test("og タグが title / description を meta[name] より優先して上書きする", async () => {
    // meta[name=description] と og:description の両方が存在する場合、og が優先される
    stubFetch(`<!DOCTYPE html>
<html>
<head>
  <title>title タグ</title>
  <meta name="description" content="name description">
  <meta property="og:title" content="og title">
  <meta property="og:description" content="og description">
</head>
<body></body>
</html>`)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ogpTitle).toBe("og title")
    expect(res.ogpDescription).toBe("og description")
  })

  test("403 (bot 対策などでブロック) の場合はエラーレスポンスを返す", async () => {
    // Cloudflare の bot 対策により取得対象がチャレンジ/403 を返すケースを再現。
    // 実ネットワークではなくスタブで再現することで、CI が外部状況に依存せず安定する。
    stubFetch("Forbidden", { status: 403 })

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res).deep.equal({
      ok: false,
      error: "Query url is not found or invalid."
    })
  })

  test("404 の場合はエラーレスポンスを返す", async () => {
    stubFetch("Not Found", { status: 404 })

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ok).toBe(false)
    expect(res.error).toBe("Query url is not found or invalid.")
  })

  test("fetch が例外を投げた場合はエラーレスポンスを返す", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"))
    vi.stubGlobal("fetch", fetchMock)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ok).toBe(false)
    expect(res.error).toBeDefined()
  })
})
