import { expect } from "chai"
import "mocha"
import {
  amazonLinkData,
  amazonLinkDataExpectedResponse,
  normalLinkData,
  normalLinkDataExpectedResponse
} from "./testData"
import { getAmazonProductInfo } from "../src/pages/api/getOgpFromAsin/src/getAmazonProductInfo"

describe("リンク先OGPデータを取得する", () => {
  it("オプション無し", async () => {
    const res = await wrapped(normalLinkData)
    expect(res).deep.equal(normalLinkDataExpectedResponse)
  })
  it("Amazon検索", async () => {
    const res = await getAmazonProductInfo(amazonLinkData)
    expect(res).deep.equal(amazonLinkDataExpectedResponse)
  })
})
