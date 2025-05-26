import { expect, test } from "vitest"
import { testAsin } from "./testData"
import { getAmazonProductInfo } from "functions/src/getAmazonProductInfo"
import { env } from "cloudflare:test"

const { PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG } = env
console.dir(env, { depth: 3 })

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
  // リクエストしたASINとレスポンスのasinが一致することを確認
  expect(res.ItemsResult.Items[0].ASIN).toBe(testAsin)
})
