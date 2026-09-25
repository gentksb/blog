import { env } from "cloudflare:workers"
import { afterEach, describe, expect, test, vi } from "vitest"
import {
  CreatorsApiHttpError,
  getAmazonProductInfo
} from "../../src/server/services/getAmazonProductInfo"

const config = {
  credentialId: "dummy-id",
  credentialSecret: "dummy-secret",
  credentialVersion: "3.3",
  partnerTag: "dummy-22",
  marketplace: "www.amazon.co.jp",
  kv: env.PAAPI_DATASTORE
}

const throttleBody = JSON.stringify({
  message: "Request rate limit exceeded.",
  type: "ThrottleException"
})

afterEach(async () => {
  vi.unstubAllGlobals()
  await env.PAAPI_DATASTORE.delete("_creators_api_oauth_token_v3.3")
})

describe("getAmazonProductInfo の HTTP エラー", () => {
  test("getItems の非 2xx 応答はステータス付きの CreatorsApiHttpError を投げる", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          Response.json({ access_token: "token", expires_in: 3600 })
        )
        .mockResolvedValueOnce(new Response(throttleBody, { status: 429 }))
    )

    const error = await getAmazonProductInfo("B000000000", config).catch(
      (e: unknown) => e
    )

    expect(error).toBeInstanceOf(CreatorsApiHttpError)
    expect(error).toMatchObject({ status: 429 })
  })

  test("トークン取得の非 2xx 応答はステータス付きの CreatorsApiHttpError を投げる", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(new Response("denied", { status: 401 }))
    )

    const error = await getAmazonProductInfo("B000000000", config).catch(
      (e: unknown) => e
    )

    expect(error).toBeInstanceOf(CreatorsApiHttpError)
    expect(error).toMatchObject({ status: 401 })
  })
})
