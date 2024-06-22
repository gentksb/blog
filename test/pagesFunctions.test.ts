// @vitest-environment edge-runtime

import { expect, test } from "vitest"
import { testAsin, amazonLinkDataExpectedResponse } from "./testData"
import { getAmazonProductInfo } from "../src/components/mdx/lib/getAmazonProductInfo"

const { PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG, PAAPI_DATASTORE } =
  process.env

if (
  typeof PAAPI_ACCESSKEY !== "string" ||
  typeof PAAPI_SECRETKEY !== "string" ||
  typeof PARTNER_TAG !== "string"
) {
  throw new Error("Environment variables are not valid")
}

test("Amazon ASINから製品データを取得する", async () => {
  const res = await getAmazonProductInfo(testAsin, {
    PAAPI_ACCESSKEY,
    PAAPI_SECRETKEY,
    PARTNER_TAG,
    PAAPI_DATASTORE // 不要だが型エラー回避のために渡す
  })
  expect(res).toMatchObject(amazonLinkDataExpectedResponse)
})
