import { expect, test } from "vitest"
import { 
  isValidAsin, 
  extractAsinFromUrl,
  validateAmazonConfig,
  createAmazonResponse
} from "../functions/src/amazonApi"
import { createMockAmazonResponse } from "./helpers/mockData"

test("Amazon API ASIN validation function works correctly", () => {
  // Test the validation function directly using the exported pure function
  // Valid ASINs
  expect(isValidAsin("B004N3APGO")).toBe(true)
  expect(isValidAsin("1234567890")).toBe(true)
  expect(isValidAsin("ABCDEFGHIJ")).toBe(true)
  
  // Invalid ASINs
  expect(isValidAsin("B004N3APG")).toBe(false) // 9 characters
  expect(isValidAsin("B004N3APGO1")).toBe(false) // 11 characters
  expect(isValidAsin("B004N3APGo")).toBe(false) // lowercase
  expect(isValidAsin("B004-N3APG")).toBe(false) // special character
  expect(isValidAsin("B004 N3APG")).toBe(false) // space
  expect(isValidAsin("")).toBe(false) // empty
})

test("Amazon API URL extraction works correctly", () => {
  // Test URL extraction using the exported pure function
  expect(extractAsinFromUrl("http://localhost/api/getAmznPa/B004N3APGO")).toBe("B004N3APGO")
  expect(extractAsinFromUrl("https://example.com/api/getAmznPa/1234567890")).toBe("1234567890")
  expect(extractAsinFromUrl("http://localhost/api/getAmznPa/")).toBeNull()
  expect(extractAsinFromUrl("http://localhost/api/other/B004N3APGO")).toBeNull()
})

test("Amazon config validation works correctly", () => {
  // Test config validation using the exported pure function
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
})

test("Amazon response creation works correctly", () => {
  // Test response creation using the exported pure function
  const mockData = createMockAmazonResponse("B004N3APGO")
  
  const response = createAmazonResponse(mockData)
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")
})