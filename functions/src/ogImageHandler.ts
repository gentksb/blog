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
    const postMetadata = await extractPostMetadata(request)
    
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
async function extractPostMetadata(request: Request): Promise<PostMetadata> {
  const imagePathSuffix = "/twitter-og.png"
  
  // Get the HTML page URL by removing the image suffix
  const htmlUrl = request.url.replace(imagePathSuffix, "")
  
  // Fetch the HTML page
  const response = await fetch(htmlUrl)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch HTML page: ${response.status}`)
  }
  
  // Parse metadata from HTML
  const postMetadata: PostMetadata = {
    title: "",
    imageUrl: ""
  }
  
  const rewriter = new HTMLRewriter()
  
  await rewriter
    .on("meta", {
      element(element) {
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