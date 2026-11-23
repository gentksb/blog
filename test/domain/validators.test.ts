import { expect, test } from "vitest"
import { isValidAsin, isValidUrl } from "../../src/server/domain/validators"

test("ASIN validation", () => {
  expect(isValidAsin("B004N3APGO")).toBe(true)

  expect(isValidAsin("B004N3APG")).toBe(false) // 9 characters
  expect(isValidAsin("B004N3APGo")).toBe(false) // lowercase
  expect(isValidAsin("B004-N3APG")).toBe(false) // special character
})

test("URL validation", () => {
  expect(isValidUrl("https://example.com/path?query=1")).toBe(true)

  expect(isValidUrl("ftp://example.com")).toBe(false)
  expect(isValidUrl("invalid-url")).toBe(false)
})
