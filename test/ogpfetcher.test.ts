import { expect, test } from "vitest"
import { getOgpMetaData } from "functions/src/getOgpMetaData"
import { normalLinkUrl, normalLinkDataExpectedResponse } from "./testData"

const encodedUrl = encodeURIComponent(normalLinkUrl)

test("URIエンコードされたURLからOGPデータを取得する", async () => {
  const res = await getOgpMetaData(encodedUrl)
  expect(res).deep.equal(normalLinkDataExpectedResponse)
})
