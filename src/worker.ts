import { handle } from "@astrojs/cloudflare/handler"
import { isAiAgentRequest, postMarkdownPathFor } from "./lib/aiAgent"
import { runMergeSchedule } from "./lib/mergeSchedule"
import { postLogToSlack } from "./server/services/postLogToSlack"

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
  },
  async scheduled(controller, env) {
    const dispatched = await runMergeSchedule({
      token: env.GITHUB_MERGE_SCHEDULE_TOKEN,
      now: new Date(controller.scheduledTime),
      notifyError: async (message) => {
        if (!env.SLACK_WEBHOOK_URL) return
        await postLogToSlack(message, env.SLACK_WEBHOOK_URL)
      }
    })
    console.log({ cron: controller.cron, dispatched })
  }
} satisfies ExportedHandler<Env>
