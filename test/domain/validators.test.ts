import { expect, test } from "vitest"
import { 
  isValidAsin, 
  extractAsinFromUrl, 
  validateAmazonConfig,
  isValidUrl,
  extractUrlFromRequest,
  validateOgpConfig,
  isValidSecFetchMode,
  isTwitterOgImageRequest
} from "../../functions/src/domain/validators"

test("ASIN validation", () => {
  expect(isValidAsin("B004N3APGO")).toBe(true)
  expect(isValidAsin("1234567890")).toBe(true)
  expect(isValidAsin("ABCDEFGHIJ")).toBe(true)
  
  expect(isValidAsin("B004N3APG")).toBe(false) // 9 characters
  expect(isValidAsin("B004N3APGO1")).toBe(false) // 11 characters
  expect(isValidAsin("B004N3APGo")).toBe(false) // lowercase
  expect(isValidAsin("B004-N3APG")).toBe(false) // special character
  expect(isValidAsin("")).toBe(false)
  expect(isValidAsin("invalid")).toBe(false)
})

test("ASIN URL extraction", () => {
  expect(extractAsinFromUrl("http://localhost/api/getAmznPa/B004N3APGO")).toBe("B004N3APGO")
  expect(extractAsinFromUrl("https://example.com/api/getAmznPa/1234567890")).toBe("1234567890")
  expect(extractAsinFromUrl("http://localhost/api/getAmznPa/")).toBeNull()
  expect(extractAsinFromUrl("http://localhost/api/other/B004N3APGO")).toBeNull()
})

test("Amazon config validation", () => {
  expect(validateAmazonConfig({
    accessKey: "test-key",
    secretKey: "test-secret",
    partnerTag: "test-tag"
  })).toBe(true)
  
  expect(validateAmazonConfig({
    accessKey: "",
    secretKey: "test-secret",
    partnerTag: "test-tag"
  })).toBe(false)
  
  expect(validateAmazonConfig({})).toBe(false)
  
  expect(validateAmazonConfig({
    accessKey: "key",
    secretKey: "secret"
  })).toBe(false) // missing partnerTag
})

// === OGP API用バリデーション関数のテスト ===

test("URL validation", () => {
  // Valid URLs
  expect(isValidUrl("https://example.com")).toBe(true)
  expect(isValidUrl("http://example.com")).toBe(true)
  expect(isValidUrl("https://example.com/path?query=1")).toBe(true)
  
  // Invalid URLs
  expect(isValidUrl("ftp://example.com")).toBe(false)
  expect(isValidUrl("invalid-url")).toBe(false)
  expect(isValidUrl("")).toBe(false)
  expect(isValidUrl("   ")).toBe(false)
})

test("URL extraction from request", () => {
  const requestWithUrl = new Request("https://example.com/api/getOgp?url=https://test.com")
  const requestWithoutUrl = new Request("https://example.com/api/getOgp")
  const requestWithEmptyUrl = new Request("https://example.com/api/getOgp?url=")
  
  expect(extractUrlFromRequest(requestWithUrl)).toBe("https://test.com")
  expect(extractUrlFromRequest(requestWithoutUrl)).toBeNull()
  expect(extractUrlFromRequest(requestWithEmptyUrl)).toBeNull()
})

test("OGP config validation", () => {
  expect(validateOgpConfig({
    slackWebhookUrl: "https://hooks.slack.com/test"
  })).toBe(true)
  
  expect(validateOgpConfig({
    slackWebhookUrl: "http://example.com"
  })).toBe(false) // not https
  
  expect(validateOgpConfig({})).toBe(false)
  
  expect(validateOgpConfig({
    slackWebhookUrl: ""
  })).toBe(false)
})

// === セキュリティミドルウェア用バリデーション関数のテスト ===

test("sec-fetch-mode validation", () => {
  // Valid modes
  expect(isValidSecFetchMode("same-origin")).toBe(true)
  expect(isValidSecFetchMode("cors")).toBe(true)
  expect(isValidSecFetchMode("same-site")).toBe(true)
  
  // Invalid modes
  expect(isValidSecFetchMode("navigate")).toBe(false)
  expect(isValidSecFetchMode("websocket")).toBe(false)
  expect(isValidSecFetchMode("no-cors")).toBe(false)
  expect(isValidSecFetchMode("")).toBe(false)
  expect(isValidSecFetchMode(null)).toBe(false)
})

// === OG画像生成用バリデーション関数のテスト ===

test("Twitter OG image request validation", () => {
  const imageRequest = new Request("https://example.com/post/test-slug/twitter-og.png")
  const nonImageRequest = new Request("https://example.com/post/test-slug")
  const differentImageRequest = new Request("https://example.com/post/test-slug/facebook-og.png")
  
  expect(isTwitterOgImageRequest(imageRequest)).toBe(true)
  expect(isTwitterOgImageRequest(nonImageRequest)).toBe(false)
  expect(isTwitterOgImageRequest(differentImageRequest)).toBe(false)
})

