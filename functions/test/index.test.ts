import { expect } from "chai"
import "mocha"
import test from "firebase-functions-test"
const firebaseTest = test()
import {
  a8LinkData,
  a8LinkDataExpectedResponse,
  amazonLinkData,
  amazonLinkDataExpectedResponse,
  normalLinkData,
  normalLinkDataExpectedResponse
} from "./testData"
firebaseTest.mockConfig({
  amazon: {
    partner_tag: process.env.PARTNER_TAG,
    paapi_secret: process.env.AMAZON_PAAPI_SECRET,
    paapi_key: process.env.AMAZON_PAAPI_KEY
  }
})
import { getOgpLinkData } from "../src/index"
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
  it("A8リンクOGP", async () => {
    const res = await wrapped(a8LinkData)
    expect(res).deep.equal(a8LinkDataExpectedResponse)
  }).timeout(10000)
})
