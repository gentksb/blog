// Respond to OPTIONS method

const isOriginAllowed = (origin: string | null) => {
  // *.gensobunya.netか、*.pages.dev、localhostを許可
  if (!origin) return false
  return (
    origin.endsWith("gensobunya.net") ||
    origin.endsWith("pages.dev") ||
    origin.includes("localhost:")
  )
}

export const onRequestOptions: PagesFunction = async (context) => {
  const reqOriginHeaderValue = context.request.headers.get("Origin")
  const origin = isOriginAllowed(reqOriginHeaderValue)
    ? reqOriginHeaderValue
    : "https://blog.gensobunya.net"
  // オリジン判定
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400"
    }
  })
}

// Set CORS to all /api responses
export const onRequest: PagesFunction = async (context) => {
  console.log(`origin is ${context.request.headers.get("Origin")}`)
  const reqOriginHeaderValue = context.request.headers.get("Origin")
  const origin = isOriginAllowed(reqOriginHeaderValue)
    ? context.request.headers.get("Origin")
    : "https://blog.gensobunya.net"
  const response = await context.next()
  response.headers.set("Access-Control-Allow-Origin", origin)
  response.headers.set("Access-Control-Max-Age", "86400")
  return response
}

// https://developers.cloudflare.com/pages/functions/examples/cors-headers/
