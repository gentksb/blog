import { expect, test } from "vitest"
import { handleMiddleware } from "../functions/src/middleware"

test("middleware allows valid sec-fetch-mode headers", async () => {
  const validModes = ["same-origin", "cors", "same-site"]
  
  for (const mode of validModes) {
    const request = new Request("http://localhost/api/getOgp?url=https://example.com", {
      method: "GET",
      headers: {
        "sec-fetch-mode": mode
      }
    })
    
    const env = {} as any
    const ctx = {} as any
    
    const response = await handleMiddleware(request, env, ctx)
    
    // Should return null (no blocking) for valid headers
    expect(response).toBe(null)
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
    
    const env = {} as any
    const ctx = {} as any
    
    const response = await handleMiddleware(request, env, ctx)
    
    expect(response).not.toBe(null)
    expect(response.status).toBe(403)
    expect(await response.text()).toBe("Forbidden")
  }
})

test("middleware blocks requests without sec-fetch-mode header", async () => {
  const request = new Request("http://localhost/api/getOgp?url=https://example.com", {
    method: "GET"
  })
  
  const env = {} as any
  const ctx = {} as any
  
  const response = await handleMiddleware(request, env, ctx)
  
  expect(response).not.toBe(null)
  expect(response.status).toBe(403)
  expect(await response.text()).toBe("Forbidden")
})