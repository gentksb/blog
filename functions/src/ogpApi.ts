/**
 * OGP API Handler
 * Handles fetching and caching of OGP metadata
 */
import { getOgpMetaData } from "./getOgpMetaData"
import { postLogToSlack } from "./postLogToSlack"

/**
 * Handles GET requests for OGP metadata
 */
export async function handleOgpApi(
  request: Request, 
  env: Env, 
  _ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  
  const searchParams = new URL(request.url).searchParams
  const url = searchParams.get("url")
  
  if (!url) {
    return new Response(
      JSON.stringify({ error: 'URL parameter is required' }),
      { 
        status: 400,
        headers: { 'content-type': 'application/json' }
      }
    )
  }
  
  try {
    // Check cache first
    const cache = await env.OGP_DATASTORE.get(url)
    
    if (cache) {
      console.log(`OGP KV cache hit for: ${url}`)
      return createOgpResponse(cache)
    }
    
    // Fetch OGP data
    const ogpData = await getOgpMetaData(url)
    const bodyString = JSON.stringify(ogpData)
    
    // Cache the result
    await env.OGP_DATASTORE.put(url, bodyString, {
      expirationTtl: 60 * 60 * 24 * 7 // 1 week
    })
    
    console.log(`OGP data cached for: ${url}`)
    return createOgpResponse(bodyString)
    
  } catch (error) {
    console.error('OGP API error:', error)
    
    // Log error to Slack
    await postLogToSlack(
      `OGP API Error: ${request.url}\nError: ${(error as Error).message}`,
      env.SLACK_WEBHOOK_URL
    )
    
    return new Response(
      JSON.stringify({ error: 'Failed to fetch OGP data' }),
      { 
        status: 500,
        headers: { 'content-type': 'application/json' }
      }
    )
  }
}

/**
 * Creates a standardized OGP response
 */
function createOgpResponse(bodyString: string): Response {
  return new Response(bodyString, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "X-Robots-Tag": "noindex",
      "cache-control": "public, max-age=86400"
    }
  })
}