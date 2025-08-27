import { expect, test } from "vitest"
import { getOgpMetaData } from "../../functions/src/services/getOgpMetaData"
import { normalLinkUrl, normalLinkDataExpectedResponse } from "../fixtures/testData"

const encodedUrl = encodeURIComponent(normalLinkUrl)

test("URIエンコードされたURLからOGPデータを取得する", async () => {
  const res = await getOgpMetaData(encodedUrl)
  expect(res).deep.equal(normalLinkDataExpectedResponse)
})
