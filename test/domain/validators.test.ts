import { expect, test } from "vitest"
import { isValidAsin, isValidUrl } from "../../src/server/domain/validators"

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
