import { expect, test } from "vitest"
import { testAsin, amazonLinkDataExpectedResponse } from "./testData"
import { getAmazonProductInfo } from "@lib/getAmazonProductInfo"
import { env } from "cloudflare:test"

const { PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG } = env

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
