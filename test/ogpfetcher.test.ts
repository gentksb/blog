import { expect, test } from "vitest"
import { fetchOgp } from "~/lib/fetcher/fetchOgp"
import { normalLinkUrl, normalLinkDataExpectedResponse } from "./testData"

const encodedUrl = encodeURIComponent(normalLinkUrl)

test("URIエンコードされたURLからOGPデータを取得する", async () => {
  const res = await fetchOgp(encodedUrl)
  expect(res).deep.equal(normalLinkDataExpectedResponse)
})
