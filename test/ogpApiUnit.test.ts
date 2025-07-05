import { expect, test, vi } from "vitest"
import { handleOgpApi } from "../functions/src/ogpApi"
import { env } from "cloudflare:test"

// Mock functions to avoid external dependencies
vi.mock("../functions/src/getOgpMetaData", () => ({
  getOgpMetaData: vi.fn().mockResolvedValue({
    ogpTitle: "Test Title",
    ogpImageUrl: "https://example.com/image.jpg",
    ogpDescription: "Test Description",
    ogpSiteName: "Test Site",
    pageurl: "https://example.com",
    ok: true
  })
}))

vi.mock("../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

// Mock Cloudflare Pages plugin to avoid font loading issues
vi.mock("@cloudflare/pages-plugin-vercel-og/api", () => ({
  ImageResponse: vi.fn().mockImplementation(() => {
    return new Response(new ArrayBuffer(100), {
      headers: { "content-type": "image/png" }
    })
  })
}))

test("OGP API requires URL parameter", async () => {
  const request = new Request("http://localhost/api/getOgp", {
    method: "GET"
  })
  
  const mockKV = {
    get: vi.fn().mockResolvedValue(null),
    put: vi.fn().mockResolvedValue(undefined)
  }
  
  const mockEnv = {
    ...env,
    OGP_DATASTORE: mockKV,
    SLACK_WEBHOOK_URL: "https://mock-webhook.com"
  }
  
  const ctx = {} as any
  
  // Should handle missing URL parameter gracefully
  const response = await handleOgpApi(request, mockEnv, ctx)
  expect(response).toBeDefined()
  expect(response.status).toBe(400)
})

test("OGP API handles encoded URLs", async () => {
  const testUrl = "https://example.com/"
  const encodedUrl = encodeURIComponent(testUrl)
  
  const request = new Request(`http://localhost/api/getOgp?url=${encodedUrl}`, {
    method: "GET"
  })
  
  const mockKV = {
    get: vi.fn().mockResolvedValue(null),
    put: vi.fn().mockResolvedValue(undefined)
  }
  
  const mockEnv = {
    ...env,
    OGP_DATASTORE: mockKV,
    SLACK_WEBHOOK_URL: "https://mock-webhook.com"
  }
  
  const ctx = {} as any
  
  const response = await handleOgpApi(request, mockEnv, ctx)
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("application/json; charset=UTF-8")
  expect(response.headers.get("X-Robots-Tag")).toBe("noindex")
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400")
})

test("OGP API returns from cache when available", async () => {
  const testUrl = "https://example.com/"
  const cachedData = JSON.stringify({
    ogpTitle: "Cached Title",
    ogpImageUrl: "https://example.com/cached.jpg",
    ogpDescription: "Cached Description",
    ogpSiteName: "Cached Site",
    pageurl: testUrl,
    ok: true
  })
  
  const request = new Request(`http://localhost/api/getOgp?url=${testUrl}`, {
    method: "GET"
  })
  
  const mockKV = {
    get: vi.fn().mockResolvedValue(cachedData),
    put: vi.fn().mockResolvedValue(undefined)
  }
  
  const mockEnv = {
    ...env,
    OGP_DATASTORE: mockKV,
    SLACK_WEBHOOK_URL: "https://mock-webhook.com"
  }
  
  const ctx = {} as any
  
  const response = await handleOgpApi(request, mockEnv, ctx)
  expect(response.status).toBe(200)
  
  const responseData = await response.json() as any
  expect(responseData.ogpTitle).toBe("Cached Title")
  
  // Should have called KV get but not put (since cache hit)
  expect(mockKV.get).toHaveBeenCalledWith(testUrl)
  expect(mockKV.put).not.toHaveBeenCalled()
})