import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { getOgpMetaData } from "../../src/server/services/getOgpMetaData"
import {
  normalLinkDataExpectedResponse,
  normalLinkOgpHtml,
  normalLinkUrl
} from "../fixtures/testData"

// getOgpMetaData は内部でグローバル fetch を直接呼び出すため、テストでは fetch をスタブして
// 制御された HTML を返す。これにより本番ドメイン (blog.gensobunya.net) への実ネットワーク
// アクセスを排除し、Cloudflare の bot 対策やサイト内容の変化に左右されない安定したテストにする。
// 検証対象は HTMLRewriter による OGP タグの抽出ロジックそのものである。

// getOgpMetaData は第2引数 (_env) を使わないため、空オブジェクトで足りる
const env = {} as Env
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

    // デコード済みの URL で、タイムアウト用の signal 付きで fetch されること
    expect(fetchMock).toHaveBeenCalledWith(
      normalLinkUrl,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
    // UA 無しを弾く配信元があるため、リクエストには User-Agent を付与する
    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>
    expect(headers["User-Agent"]).toBeTruthy()
    // deep equal なので、構造化データの無いページで productPrice が生えないことも兼ねる
    expect(res).deep.equal(normalLinkDataExpectedResponse)
  })

  test("og タグが無い場合は title / meta[name=description] にフォールバックする", async () => {
    stubFetch(`<!DOCTYPE html>
<html>
<head>
  <title>タイトルタグの値</title>
  <meta name="description" content="meta description の値">
</head>
<body></body>
</html>`)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ok).toBe(true)
    expect(res.ogpTitle).toBe("タイトルタグの値")
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

  // 403 は bot 対策によるブロック、404 はリンク切れ。呼び出し側が区別できるよう
  // エラー文にはステータスと所要時間を含める
  test.each([403, 404])(
    "HTTP %i はステータス付きのエラーレスポンスを返す",
    async (status) => {
      stubFetch("error body", { status })

      const res = await getOgpMetaData(normalLinkUrl, env)

      expect(res.ok).toBe(false)
      expect(res.error).toMatch(
        new RegExp(`^HTTP ${status} from origin \\(\\d+ms\\)$`)
      )
    }
  )

  test("JSON-LD が無い場合は OGP 価格メタタグにフォールバックする", async () => {
    stubFetch(`<!DOCTYPE html>
<html>
<head>
  <title>商品ページ</title>
  <meta property="og:price:amount" content="1980">
  <meta property="og:price:currency" content="JPY">
</head>
<body></body>
</html>`)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.productPrice).toEqual({ amount: 1980, currency: "JPY" })
  })

  // JSON-LD 側が採用されることは、script[type=ld+json] の抽出が動いていることも示す
  test("JSON-LD の価格が価格メタタグより優先される", async () => {
    stubFetch(`<!DOCTYPE html>
<html>
<head>
  <meta property="product:price:amount" content="9999">
  <meta property="product:price:currency" content="JPY">
  <script type="application/ld+json">
  {
    "@type": "Product",
    "offers": { "@type": "Offer", "price": "12800", "priceCurrency": "JPY" }
  }
  </script>
</head>
<body></body>
</html>`)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.productPrice).toEqual({ amount: 12800, currency: "JPY" })
  })

  test("壊れた JSON-LD があっても他の OGP データは取得できる", async () => {
    stubFetch(`<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="og title">
  <script type="application/ld+json">{broken json</script>
</head>
<body></body>
</html>`)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ok).toBe(true)
    expect(res.ogpTitle).toBe("og title")
    expect(res.productPrice).toBeUndefined()
  })

  test("fetch が例外を投げた場合はエラーレスポンスを返す", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"))
    vi.stubGlobal("fetch", fetchMock)

    const res = await getOgpMetaData(normalLinkUrl, env)

    expect(res.ok).toBe(false)
    expect(res.error).toMatch(/^network down \(\d+ms\)$/)
  })
})
