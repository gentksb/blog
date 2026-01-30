import { env } from "cloudflare:test"
import { getAmazonProductInfo } from "functions/src/services/getAmazonProductInfo"
import { expect, test } from "vitest"
import { testAsin } from "../fixtures/testData"

const { CREATORS_CREDENTIAL_ID, CREATORS_CREDENTIAL_SECRET, PARTNER_TAG } = env
console.dir(env, { depth: 3 })

if (!CREATORS_CREDENTIAL_ID || !CREATORS_CREDENTIAL_SECRET || !PARTNER_TAG) {
  throw new Error("Environment variables are not valid")
}
test("Amazon ASINから製品データを取得する（Creators API）", async () => {
  const res = await getAmazonProductInfo(
    testAsin,
    CREATORS_CREDENTIAL_ID,
    CREATORS_CREDENTIAL_SECRET,
    PARTNER_TAG
  )
  // リクエストしたASINとレスポンスのasinが一致することを確認
  expect(res.ItemsResult.Items[0].ASIN).toBe(testAsin)
})
