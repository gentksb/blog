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
    
    // Generate OG image
    const imageResponse = await ogImage(
      postMetadata.title.replace(" | 幻想サイクル", ""),
      postMetadata.imageUrl || "https://blog.gensobunya.net/image/logo.jpg"
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