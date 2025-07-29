// Main Worker entry point for blog functions
// This replaces the Pages Functions routing system

import { handleMiddleware } from './src/middleware'
import { handleOgpApi } from './src/ogpApi'
import { handleAmazonApi } from './src/amazonApi'
import { handleOgImage } from './src/ogImageHandler'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // Handle API routes with middleware
    if (pathname.startsWith('/api/')) {
      // Apply middleware for API routes
      const middlewareResult = await handleMiddleware(request, env, ctx)
      if (middlewareResult) {
        return middlewareResult // Return error response if middleware blocks
      }
      
      // Route to specific API handlers
      if (pathname.startsWith('/api/getOgp')) {
        return handleOgpApi(request, env, ctx)
      }
      
      if (pathname.startsWith('/api/getAmznPa/')) {
        return handleAmazonApi(request, env, ctx)
      }
      
      return new Response('Not Found', { status: 404 })
    }
    
    // Handle OG image generation
    if (pathname.startsWith('/post/') && pathname.endsWith('/twitter-og.png')) {
      return handleOgImage(request, env, ctx)
    }
    
    // Serve static assets for all other requests
    return env.ASSETS.fetch(request)
  }
} satisfies ExportedHandler<Env>