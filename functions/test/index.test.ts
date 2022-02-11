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

import { getOgpLinkData } from "../src/index"
import {
  a8LinkData,
  a8LinkDataExpectedResponse,
  amazonLinkData,
  amazonLinkDataExpectedResponse,
  // invalidAmazonAsinData,
  // invalidAmazonAsinDataResponse,
  normalLinkData,
  normalLinkDataExpectedResponse
} from "./testData"
const wrapped = firebaseTest.wrap(getOgpLinkData)
after(() => firebaseTest.cleanup())

describe("リンク先OGPデータを取得する", () => {
  it("オプション無し", async () => {
    const res = await wrapped(normalLinkData)
    expect(res).deep.equal(normalLinkDataExpectedResponse)
  })
  it("Amazon検索", async () => {
    const res = await wrapped(amazonLinkData)
    expect(res).deep.equal(amazonLinkDataExpectedResponse)
  })
  // it("Amazonリンク不備", async () => {
  //   const res = await wrapped(invalidAmazonAsinData)
  //   expect(res).to.throw()
  // })
  it("A8リンクOGP", async () => {
    const res = await wrapped(a8LinkData)
    expect(res).deep.equal(a8LinkDataExpectedResponse)
  })
})
