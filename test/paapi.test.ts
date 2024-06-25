import { expect, test } from "vitest"
import { testAsin, amazonLinkDataExpectedResponse } from "./testData"
import { getAmazonProductInfo } from "@lib/getAmazonProductInfo"
import { env } from "cloudflare:test"

// ローカルテストはCloudflareのenv、GHAは環境変数から取得
// なぜそうしないといけないのかは不明
const PAAPI_ACCESSKEY = env.PAAPI_ACCESSKEY ?? process.env.PAAPI_ACCESSKEY
const PAAPI_SECRETKEY = env.PAAPI_SECRETKEY ?? process.env.PAAPI_SECRETKEY
const PARTNER_TAG = env.PARTNER_TAG ?? process.env.PARTNER_TAG

if (!PAAPI_ACCESSKEY || !PAAPI_SECRETKEY || !PARTNER_TAG) {
  throw new Error("Environment variables are not valid")
}
test("Amazon ASINから製品データを取得する", async () => {
  const res = await getAmazonProductInfo(
    testAsin,
    PAAPI_ACCESSKEY,
    PAAPI_SECRETKEY,
    PARTNER_TAG
  )
  expect(res).toMatchObject(amazonLinkDataExpectedResponse)
})
