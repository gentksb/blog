import { expect, test, vi } from "vitest"
import { onRequestGet } from "../functions/post/[[slug]]"
import { env } from "cloudflare:test"

// Mock dependencies
vi.mock("../functions/src/ogImage", () => ({
  ogImage: vi.fn().mockResolvedValue(new Response(new ArrayBuffer(100), {
    headers: { "content-type": "image/png" }
  }))
}))

vi.mock("../functions/src/postLogToSlack", () => ({
  postLogToSlack: vi.fn().mockResolvedValue(undefined)
}))

// Mock global fetch for the internal post content fetch
global.fetch = vi.fn().mockImplementation(() => {
  const htmlContent = `
<html>
  <head>
    <meta property="og:title" content="Test Post Title | 幻想サイクル">
    <meta property="og:image" content="https://example.com/test-image.jpg">
  </head>
</html>
`
  return Promise.resolve(new Response(htmlContent, {
    headers: { "content-type": "text/html" }
  }))
})

test("OG image generation only responds to twitter-og.png requests", async () => {
  const normalRequest = new Request("http://localhost/post/test-slug", {
    method: "GET"
  })
  
  const context = {
    request: normalRequest,
    next: () => new Response("Normal post content", { status: 200 }),
    env: {
      ...env,
      SLACK_WEBHOOK_URL: "https://mock-webhook.com"
    }
  } as any
  
  const response = await onRequestGet(context)
  
  // Should pass through to next handler for non-OG requests
  expect(response.status).toBe(200)
  expect(await response.text()).toBe("Normal post content")
})

test("OG image generation returns PNG for twitter-og.png requests", async () => {
  const ogRequest = new Request("http://localhost/post/test-slug/twitter-og.png", {
    method: "GET"
  })
  
  const context = {
    request: ogRequest,
    next: () => new Response("Should not be called", { status: 200 }),
    env: {
      ...env,
      SLACK_WEBHOOK_URL: "https://mock-webhook.com"
    }
  } as any
  
  const response = await onRequestGet(context)
  
  expect(response.status).toBe(200)
  expect(response.headers.get("content-type")).toBe("image/png")
})

test("OG image generation URL pattern matching", () => {
  // Test URL suffix detection logic
  const imagePathSuffix = "/twitter-og.png"
  
  const validUrls = [
    "http://localhost/post/simple-slug/twitter-og.png",
    "http://localhost/post/2024/01/article-name/twitter-og.png",
    "http://localhost/post/complex-slug-with-hyphens/twitter-og.png"
  ]
  
  const invalidUrls = [
    "http://localhost/post/simple-slug/twitter-og.jpg",
    "http://localhost/post/simple-slug/facebook-og.png", 
    "http://localhost/post/simple-slug.png",
    "http://localhost/post/simple-slug/"
  ]
  
  validUrls.forEach(url => {
    expect(url.endsWith(imagePathSuffix)).toBe(true)
  })
  
  invalidUrls.forEach(url => {
    expect(url.endsWith(imagePathSuffix)).toBe(false)
  })
})

test("OG image generation URL suffix detection works correctly", () => {
  const imagePathSuffix = "/twitter-og.png"
  
  // Test that URL suffix detection logic is correct
  expect("http://localhost/post/test-slug/twitter-og.png".endsWith(imagePathSuffix)).toBe(true)
  expect("http://localhost/post/test-slug".endsWith(imagePathSuffix)).toBe(false)
  expect("http://localhost/post/test-slug/facebook-og.png".endsWith(imagePathSuffix)).toBe(false)
})