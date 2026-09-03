import { env } from "cloudflare:workers"
import { getAmazonProductInfo } from "../../src/server/services/getAmazonProductInfo"
import { expect, test } from "vitest"
import { testAsin } from "../fixtures/testData"

const {
  CREATORS_CREDENTIAL_ID,
  CREATORS_CREDENTIAL_SECRET,
  CREATORS_CREDENTIAL_VERSION,
  PARTNER_TAG
} = env

if (
  !CREATORS_CREDENTIAL_ID ||
  !CREATORS_CREDENTIAL_SECRET ||
  !CREATORS_CREDENTIAL_VERSION ||
  !PARTNER_TAG
) {
  throw new Error("Environment variables are not valid")
}
test("Amazon ASINから製品データを取得する", async () => {
  const res = await getAmazonProductInfo(testAsin, {
    credentialId: CREATORS_CREDENTIAL_ID,
    credentialSecret: CREATORS_CREDENTIAL_SECRET,
    credentialVersion: CREATORS_CREDENTIAL_VERSION,
    partnerTag: PARTNER_TAG,
    marketplace: "www.amazon.co.jp",
    kv: env.PAAPI_DATASTORE
  })
  // リクエストしたASINとレスポンスのasinが一致することを確認
  expect(res.itemsResult.items[0].asin).toBe(testAsin)
})
