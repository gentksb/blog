import { handle } from "@astrojs/cloudflare/handler"
import { isAiAgentRequest, postMarkdownPathFor } from "./lib/aiAgent"

export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET" || request.method === "HEAD") {
      const url = new URL(request.url)
      const mdPath = postMarkdownPathFor(url.pathname)
      if (mdPath) {
        const cf = request.cf as { verifiedBotCategory?: string } | undefined
        const isAi = isAiAgentRequest({
          userAgent: request.headers.get("user-agent"),
          accept: request.headers.get("accept"),
          verifiedBotCategory: cf?.verifiedBotCategory
        })
        if (isAi) {
          const mdRequest = new Request(new URL(mdPath, url), request)
          const response = await handle(mdRequest, env, ctx)
          if (response.ok) {
            const headers = new Headers(response.headers)
            headers.set("content-location", mdPath)
            headers.set("vary", "user-agent, accept")
            return new Response(response.body, {
              status: response.status,
              headers
            })
          }
          // .md生成に失敗した場合は通常のHTMLにフォールバック
        }
      }
    }
    return handle(request, env, ctx)
  }
} satisfies ExportedHandler<Env>
