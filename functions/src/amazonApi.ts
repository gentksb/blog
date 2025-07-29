/**
 * Amazon Product API Handler
 * Handles fetching and caching of Amazon product information via PA-API
 */
import { getAmazonProductInfo } from "./getAmazonProductInfo"
import { postLogToSlack } from "./postLogToSlack"
import type { AmazonItemsResponse } from "amazon-paapi"

/**
 * Handles GET requests for Amazon product information
 */
export async function handleAmazonApi(
  request: Request, 
  env: Env, 
  _ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  
  try {
    // Extract ASIN from URL path
    const asin = extractAsinFromUrl(request.url)
    
    // Validate ASIN format
    if (!asin || !isValidAsin(asin)) {
      const errorMsg = `Invalid ASIN format: ${asin}`
      console.error(errorMsg)
      
      await postLogToSlack(
        `Amazon API Error: ${request.url}\n${errorMsg}`,
        env.SLACK_WEBHOOK_URL
      )
      
      throw new Error("asin is't valid.")
    }
    
    console.log(`Requested ASIN: ${asin}`)
    
    // Check cache first
    const cachedData: AmazonItemsResponse | null = await env.PAAPI_DATASTORE.get(asin, "json")
    
    if (cachedData) {
      console.log(`Amazon PA-API cache hit for ASIN: ${asin}`)
      return createAmazonResponse(cachedData)
    }
    
    // Fetch product data from PA-API
    const productData = await getAmazonProductInfo(
      asin,
      env.PAAPI_ACCESSKEY,
      env.PAAPI_SECRETKEY,
      env.PARTNER_TAG
    )
    
    // Cache the result
    await env.PAAPI_DATASTORE.put(asin, JSON.stringify(productData), {
      expirationTtl: 60 * 60 * 24 // 24 hours
    })
    
    console.log(`Amazon product data cached for ASIN: ${asin}`)
    return createAmazonResponse(productData)
    
  } catch (error) {
    console.error('Amazon API error:', error)
    
    // Log error to Slack
    await postLogToSlack(
      `Amazon API Error: ${request.url}\nError: ${(error as Error).message}`,
      env.SLACK_WEBHOOK_URL
    )
    
    throw error
  }
}

/**
 * Extracts ASIN from URL path
 */
function extractAsinFromUrl(url: string): string | null {
  const urlObj = new URL(url)
  const pathSegments = urlObj.pathname.split('/')
  
  // Expected format: /api/getAmznPa/{asin}
  const asinIndex = pathSegments.indexOf('getAmznPa') + 1
  return pathSegments[asinIndex] || null
}

/**
 * Validates ASIN format
 */
function isValidAsin(asin: string): boolean {
  if (typeof asin !== 'string') {
    return false
  }
  return /^[A-Z0-9]{10}$/.test(asin)
}

/**
 * Creates a standardized Amazon API response
 */
function createAmazonResponse(productData: AmazonItemsResponse): Response {
  return new Response(JSON.stringify(productData), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=86400",
      "x-robots-tag": "noindex"
    }
  })
}