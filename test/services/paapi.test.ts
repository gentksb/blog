import { env } from "cloudflare:test"
import { getAmazonProductInfo } from "../../src/server/services/getAmazonProductInfo"
import { expect, test } from "vitest"
import { testAsin } from "../fixtures/testData"

const { CREATORS_CREDENTIAL_ID, CREATORS_CREDENTIAL_SECRET, PARTNER_TAG } = env
console.dir(env, { depth: 3 })

if (!CREATORS_CREDENTIAL_ID || !CREATORS_CREDENTIAL_SECRET || !PARTNER_TAG) {
  throw new Error("Environment variables are not valid")
}
test("Amazon ASINから製品データを取得する", async () => {
  const res = await getAmazonProductInfo(testAsin, {
    credentialId: CREATORS_CREDENTIAL_ID,
    credentialSecret: CREATORS_CREDENTIAL_SECRET,
    credentialVersion: "2.3",
    partnerTag: PARTNER_TAG,
    marketplace: "www.amazon.co.jp",
    kv: env.PAAPI_DATASTORE
  })
  // リクエストしたASINとレスポンスのasinが一致することを確認
  expect(res.itemsResult.items[0].asin).toBe(testAsin)
})
