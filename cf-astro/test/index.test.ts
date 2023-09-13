import { expect, test } from "vitest"
import {
  testAsin,
  amazonLinkDataExpectedResponse,
  normalLinkUrl,
  normalLinkDataExpectedResponse
} from "./testData"
import { getAmazonProductInfo } from "../functions/api/getOgpFromAsin/src/getAmazonProductInfo"

const { PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG } = process.env
console.log(PAAPI_ACCESSKEY)

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
  expect(res).deep.equal(amazonLinkDataExpectedResponse)
})
