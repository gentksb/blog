// Respond to OPTIONS method

export const onRequestOptions: PagesFunction = async (context) => {
  // アクセスしてきたホストのみ許可
  // local, GitブランチのPreview URL, 本番URLでそれぞれアクセス時のOriginを取得
  const origin = context.request.headers.get("Origin")
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
  const response = await context.next()
  const origin = context.request.headers.get("Origin")
  response.headers.set("Access-Control-Allow-Origin", origin)
  response.headers.set("Access-Control-Max-Age", "86400")
  return response
}

// https://developers.cloudflare.com/pages/functions/examples/cors-headers/
