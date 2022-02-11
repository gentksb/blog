import { expect } from "chai"
import "mocha"

describe("This", () => {
  describe("should", () => {
    it("always pass", () => {
      expect(true).to.equal(true)
    })
  })
})

import test from "firebase-functions-test"
const firebaseTest = test()
firebaseTest.mockConfig({
  amazon: {
    partner_tag: process.env.PARTNER_TAG,
    paapi_secret: process.env.AMAZON_PAAPI_SECRET,
    paapi_key: process.env.AMAZON_PAAPI_KEY
  }
})

import { getOgpLinkData, ResType } from "../src/index"
import { normalLinkData } from "./testData"

const wrappedFunction = firebaseTest.wrap(getOgpLinkData)

const normalLinkTest: ResType = await wrappedFunction(normalLinkData).result
describe("リンク先OGPデータを取得する", () => {
  it("オプション無し", () => {
    console.log(normalLinkTest)
    // expect(normalLinkTest.pageurl).to.equal("https://blog.gensobunya.net/")
    // expect(normalLinkTest.imageUrl).to.equal(
    //   "https://blog.gensobunya.net/image/logo.jpg"
    // )
    // expect(normalLinkTest.title).to.equal("幻想サイクル")
  })
})
