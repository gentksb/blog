import { expect, test } from "vitest"
import { 
  isValidAsin, 
  extractAsinFromUrl, 
  validateAmazonConfig 
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