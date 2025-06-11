import { expect, test } from "vitest"
import { onRequest } from "../functions/api/_middleware"

test("middleware allows valid sec-fetch-mode headers", async () => {
  const validModes = ["same-origin", "cors", "same-site"]
  
  for (const mode of validModes) {
    const request = new Request("http://localhost/api/getOgp?url=https://example.com", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })
    
    const context = {
      request,
      next: () => new Response("OK", { status: 200 })
    } as any
    
    const response = await onRequest(context)
    
    // Should not be blocked by middleware (status should not be 403)
    expect(response.status).not.toBe(403)
  }
})

test("middleware blocks invalid sec-fetch-mode headers", async () => {
  const invalidModes = ["navigate", "websocket", "no-cors", ""]
  
  for (const mode of invalidModes) {
    const request = new Request("http://localhost/api/getOgp?url=https://example.com", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })
    
    const context = {
      request,
      next: () => new Response("OK", { status: 200 })
    } as any
    
    const response = await onRequest(context)
    
    expect(response.status).toBe(403)
    expect(await response.text()).toBe("Forbidden")
  }
})

test("middleware blocks requests without sec-fetch-mode header", async () => {
  const request = new Request("http://localhost/api/getOgp?url=https://example.com", {
    method: "GET"
  })
  
  const context = {
    request,
    next: () => new Response("OK", { status: 200 })
  } as any
  
  const response = await onRequest(context)
  
  expect(response.status).toBe(403)
  expect(await response.text()).toBe("Forbidden")
})