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

  // レスポンス全体をログ出力（デバッグ用）
  console.log("Full API Response:", JSON.stringify(res, null, 2))

  // ItemsResult が存在することを確認
  expect(res.ItemsResult).toBeDefined()
  expect(res.ItemsResult.Items).toBeDefined()
  expect(res.ItemsResult.Items.length).toBeGreaterThan(0)

  // リクエストしたASINとレスポンスのasinが一致することを確認
  expect(res.ItemsResult.Items[0].ASIN).toBe(testAsin)
})
