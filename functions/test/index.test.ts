import { expect, assert } from "chai"
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
import { normalLinkData, normalLinkDataExpectedResponse } from "./testData"
const wrapped = firebaseTest.wrap(getOgpLinkData)
after(() => firebaseTest.cleanup())

describe("リンク先OGPデータを取得する", () => {
  it("オプション無し", async () => {
    try {
      const res = await wrapped(normalLinkData)
      assert.deepEqual(res, normalLinkDataExpectedResponse)
    } catch (e) {
      throw e
    }
  })
})
