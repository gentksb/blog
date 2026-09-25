import { env } from "cloudflare:workers"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { getAmazonProductInfo } from "../../src/server/services/getAmazonProductInfo"

const config = {
  credentialId: "dummy-id",
  credentialSecret: "dummy-secret",
  credentialVersion: "3.3",
  partnerTag: "dummy-22",
  marketplace: "www.amazon.co.jp",
  kv: env.PAAPI_DATASTORE
}

const tokenResponse = () =>
  Response.json({ access_token: "token", expires_in: 3600 })

const throttleResponse = () =>
  Response.json(
    { message: "Request rate limit exceeded.", type: "ThrottleException" },
    { status: 429 }
  )

const itemsResponse = () =>
  Response.json({
    itemsResult: {
      items: [{ asin: "B000000000", detailPageURL: "https://example.com" }]
    }
  })

const getItemsCalls = (fetchMock: ReturnType<typeof vi.fn>) =>
  fetchMock.mock.calls.filter(([url]) => String(url).endsWith("/getItems"))

let warnSpy: ReturnType<typeof vi.spyOn>
let infoSpy: ReturnType<typeof vi.spyOn>
let backoffDelays: number[]

beforeEach(() => {
  // 待ち時間だけ記録して即時に進め、テストが実時間で待たないようにする
  backoffDelays = []
  vi.spyOn(globalThis, "setTimeout").mockImplementation(((
    handler: () => void,
    ms?: number
  ) => {
    backoffDelays.push(ms ?? 0)
    handler()
    return 0
  }) as typeof setTimeout)
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
  infoSpy = vi.spyOn(console, "info").mockImplementation(() => {})
})

afterEach(async () => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  await env.PAAPI_DATASTORE.delete("_creators_api_oauth_token_v3.3")
})

describe("getAmazonProductInfo の再試行", () => {
  test.each([429, 503])(
    "getItems が %i の後に 200 を返せば商品データを返し、回復をログに残す",
    async (status) => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(tokenResponse())
        .mockResolvedValueOnce(
          status === 429
            ? throttleResponse()
            : new Response("unavailable", { status })
        )
        .mockResolvedValueOnce(itemsResponse())
      vi.stubGlobal("fetch", fetchMock)

      const res = await getAmazonProductInfo("B000000000", config)

      expect(res.itemsResult.items[0].asin).toBe("B000000000")
      expect(getItemsCalls(fetchMock)).toHaveLength(2)
      expect(backoffDelays).toHaveLength(1)
      expect(backoffDelays[0]).toBeGreaterThanOrEqual(1000)
      expect(backoffDelays[0]).toBeLessThanOrEqual(2000)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringMatching(`^Creators API ${status} for ASIN B000000000`)
      )
      expect(infoSpy).toHaveBeenCalledWith(
        "Creators API recovered for ASIN B000000000 after 1 retries"
      )
    }
  )

  test("429 が続くと 2 回再試行した後に再試行回数付きで失敗する", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockImplementation(async () => throttleResponse())
    vi.stubGlobal("fetch", fetchMock)

    await expect(getAmazonProductInfo("B000000000", config)).rejects.toThrow(
      /^Creators API error: 429 .*\(retries: 2\)$/
    )
    expect(getItemsCalls(fetchMock)).toHaveLength(3)
    expect(backoffDelays).toHaveLength(2)
    expect(backoffDelays[1]).toBeGreaterThanOrEqual(1000)
    expect(backoffDelays[1]).toBeLessThanOrEqual(3000)
  })

  test("400 は再試行せずに失敗する", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(tokenResponse())
      .mockResolvedValueOnce(new Response("bad request", { status: 400 }))
    vi.stubGlobal("fetch", fetchMock)

    await expect(getAmazonProductInfo("B000000000", config)).rejects.toThrow(
      "Creators API error: 400 bad request (retries: 0)"
    )
    expect(getItemsCalls(fetchMock)).toHaveLength(1)
  })

  test("トークン取得の失敗は再試行せずに失敗する", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("denied", { status: 401 }))
    vi.stubGlobal("fetch", fetchMock)

    await expect(getAmazonProductInfo("B000000000", config)).rejects.toThrow(
      "Failed to fetch access token: 401 denied"
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
