/**
 * OG Image Generation Handler
 * Handles dynamic OG image generation for blog posts
 */
import { ogImage } from "./ogImage"
import { postLogToSlack } from "./postLogToSlack"

interface PostMetadata {
  title: string
  imageUrl: string
}

/**
 * Handles GET requests for OG image generation
 */
export async function handleOgImage(
  request: Request, 
  env: Env, 
  _ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  
  try {
    // Extract metadata from the corresponding HTML page
    const postMetadata = await extractPostMetadata(request, env)
    
    // Get the current host from the request
    const currentHost = new URL(request.url).origin
    const fallbackImageUrl = `${currentHost}/image/logo.jpg`
    
    // Process image URL to use current host
    const processedImageUrl = await processImageUrl(postMetadata.imageUrl, currentHost, fallbackImageUrl, env)
    
    console.log(`OG Image: Using image URL: ${processedImageUrl}`)
    
    // Generate OG image
    const imageResponse = await ogImage(
      postMetadata.title.replace(" | 幻想サイクル", ""),
      processedImageUrl,
      currentHost
    )
    
    return imageResponse
    
  } catch (error) {
    console.error("Error generating OG image:", error)
    
    // Log error to Slack
    await postLogToSlack(
      `OG Image Generation Error: ${request.url}\nError: ${(error as Error).message}`,
      env.SLACK_WEBHOOK_URL
    )
    
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error"
    })
  }
}

/**
 * Extracts post metadata from the HTML page
 */
async function extractPostMetadata(request: Request, env: Env): Promise<PostMetadata> {
  const imagePathSuffix = "/twitter-og.png"
  
  // Get the HTML page URL by removing the image suffix
  const htmlUrl = request.url.replace(imagePathSuffix, "")
  
  console.log(`OG Image: Attempting to fetch HTML from: ${htmlUrl}`)
  
  // Create a new request for the HTML page
  const htmlRequest = new Request(htmlUrl, {
    method: "GET",
    headers: request.headers
  })
  
  // Fetch the HTML page from static assets
  const response = await env.ASSETS.fetch(htmlRequest)
  
  console.log(`OG Image: HTML fetch response status: ${response.status}`)
  
  if (!response.ok) {
    // Try alternative path with trailing slash
    const alternativeUrl = htmlUrl.endsWith('/') ? htmlUrl : htmlUrl + '/'
    console.log(`OG Image: Trying alternative URL: ${alternativeUrl}`)
    
    const alternativeRequest = new Request(alternativeUrl, {
      method: "GET",
      headers: request.headers
    })
    
    const alternativeResponse = await env.ASSETS.fetch(alternativeRequest)
    console.log(`OG Image: Alternative fetch response status: ${alternativeResponse.status}`)
    
    if (!alternativeResponse.ok) {
      throw new Error(`Failed to fetch HTML page: ${response.status} (original), ${alternativeResponse.status} (alternative)`)
    }
    
    return parseHtmlForMetadata(alternativeResponse)
  }
  
  return parseHtmlForMetadata(response)
}

/**
 * Parses HTML response for OG metadata
 */
async function parseHtmlForMetadata(response: Response): Promise<PostMetadata> {
  const postMetadata: PostMetadata = {
    title: "",
    imageUrl: ""
  }
  
  const rewriter = new HTMLRewriter()
  
  await rewriter
    .on("meta", {
      element(element: Element) {
        const property = element.getAttribute("property")
        const content = element.getAttribute("content") || ""
        
        switch (property) {
          case "og:title":
            postMetadata.title = content
            break
          case "og:image":
            postMetadata.imageUrl = content
            break
          default:
            break
        }
      }
    })
    .transform(response)
    .arrayBuffer()
  
  return postMetadata
}

/**
 * Processes image URL to use the current request host and resolves Astro optimized images
 */
async function processImageUrl(imageUrl: string, currentHost: string, fallbackImageUrl: string, env: Env): Promise<string> {
  if (!imageUrl) {
    console.log("OG Image: No image URL provided, using fallback")
    return fallbackImageUrl
  }
  
  console.log(`OG Image: Original image URL: ${imageUrl}`)
  console.log(`OG Image: Current host: ${currentHost}`)
  
  try {
    const url = new URL(imageUrl)
    
    // Check if it's pointing to the production domain
    if (url.hostname === 'blog.gensobunya.net') {
      // Replace with current host
      const newImageUrl = `${currentHost}${url.pathname}${url.search}${url.hash}`
      console.log(`OG Image: Converted production URL to current host: ${newImageUrl}`)
      
      // If it's an Astro optimized image, try to resolve the correct hash for current environment
      if (url.pathname.includes('/_astro/')) {
        const resolvedUrl = await resolveAstroImageUrl(newImageUrl, currentHost, fallbackImageUrl, env)
        return resolvedUrl
      }
      
      return newImageUrl
    }
    
    // If it's already using the current host
    if (url.hostname === new URL(currentHost).hostname) {
      if (url.pathname.includes('/_astro/')) {
        const resolvedUrl = await resolveAstroImageUrl(imageUrl, currentHost, fallbackImageUrl, env)
        return resolvedUrl
      }
    }
    
    // If it's already using the current host or another domain, use as-is
    console.log(`OG Image: Using original URL: ${imageUrl}`)
    return imageUrl
    
  } catch (error) {
    // If URL parsing fails, it might be a relative URL
    if (imageUrl.startsWith('/')) {
      const absoluteUrl = `${currentHost}${imageUrl}`
      console.log(`OG Image: Converting relative URL to current host: ${absoluteUrl}`)
      
      if (imageUrl.includes('/_astro/')) {
        const resolvedUrl = await resolveAstroImageUrl(absoluteUrl, currentHost, fallbackImageUrl, env)
        return resolvedUrl
      }
      
      return absoluteUrl
    }
    
    console.log(`OG Image: Invalid URL format, using fallback: ${imageUrl}`)
    return fallbackImageUrl
  }
}

/**
 * Resolves Astro optimized image URL for the current environment
 */
async function resolveAstroImageUrl(astroImageUrl: string, currentHost: string, fallbackImageUrl: string, env: Env): Promise<string> {
  console.log(`OG Image: Attempting to resolve Astro image: ${astroImageUrl}`)
  
  // First, try the original URL - it might work in the same environment
  try {
    const testRequest = new Request(astroImageUrl)
    const testResponse = await env.ASSETS.fetch(testRequest)
    
    if (testResponse.ok) {
      console.log(`OG Image: Original Astro image URL works: ${astroImageUrl}`)
      return astroImageUrl
    }
    
    console.log(`OG Image: Original Astro image not found (${testResponse.status}), attempting to find alternative`)
  } catch (error) {
    console.log(`OG Image: Error testing original Astro image: ${error}`)
  }
  
  // If original doesn't work, try to find a similar image in _astro directory
  const url = new URL(astroImageUrl)
  const pathParts = url.pathname.split('/')
  const filename = pathParts[pathParts.length - 1]
  
  // Extract the base name (everything before the hash)
  const baseNameMatch = filename.match(/^(.+?)\.([a-zA-Z0-9]+)\.(jpg|jpeg|png|webp)$/i)
  if (baseNameMatch) {
    const [, baseName, , extension] = baseNameMatch
    console.log(`OG Image: Looking for alternative ${baseName}.*.${extension} in _astro directory`)
    
    // Try common alternative patterns (this is a heuristic approach)
    const commonPatterns = [
      `${baseName}.webp`,
      `cover.webp`,
      'cover.jpg', 
      'cover.jpeg',
      'cover.png'
    ]
    
    for (const pattern of commonPatterns) {
      // Try to find files with this pattern in _astro
      const testUrl = `${currentHost}/_astro/${pattern}`
      try {
        const testRequest = new Request(testUrl)
        const testResponse = await env.ASSETS.fetch(testRequest)
        
        if (testResponse.ok) {
          console.log(`OG Image: Found alternative Astro image: ${testUrl}`)
          return testUrl
        }
      } catch (error) {
        // Continue to next pattern
      }
    }
  }
  
  console.log(`OG Image: Could not resolve Astro image, using fallback: ${fallbackImageUrl}`)
  return fallbackImageUrl
}