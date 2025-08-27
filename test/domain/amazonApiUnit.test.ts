import { expect, test } from "vitest"
import { createAmazonResponse } from "../../functions/src/amazonApi"
import { createMockAmazonResponse } from "../helpers/mockData"

test("Amazon response creation works correctly", () => {
  // Test response creation using the exported pure function
  const mockData = createMockAmazonResponse("B004N3APGO")

  const response = createAmazonResponse(mockData)
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")
})
