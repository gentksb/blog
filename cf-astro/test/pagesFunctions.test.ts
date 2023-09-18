// @vitest-environment edge-runtime

import { expect, test } from "vitest"
import { testAsin, amazonLinkDataExpectedResponse } from "./testData"
import { getAmazonProductInfo } from "../functions/api/getOgpFromAsin/src/getAmazonProductInfo"

const { PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG } = process.env

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
    PARTNER_TAG
  })
  expect(res).toMatchObject(amazonLinkDataExpectedResponse)
})
