export const AI_VERIFIED_BOT_CATEGORIES = [
  "AI Crawler",
  "AI Search",
  "AI Assistant"
]

const AI_USER_AGENT_PATTERNS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "claude-web",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Google-CloudVertexBot",
  "GoogleAgent",
  "meta-externalagent",
  "meta-externalfetcher",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "MistralAI-User",
  "DuckAssistBot"
]

export const isAiAgentRequest = (input: {
  userAgent: string | null
  accept: string | null
  verifiedBotCategory?: string
}): boolean => {
  // 1. Cloudflare verifiedBotCategory による判定
  if (
    input.verifiedBotCategory &&
    AI_VERIFIED_BOT_CATEGORIES.includes(input.verifiedBotCategory)
  ) {
    return true
  }

  // 2. Accept ヘッダーに text/markdown を含む
  if (input.accept && input.accept.includes("text/markdown")) {
    return true
  }

  // 3. User-Agent による既知AIボット判定（大文字小文字無視）
  if (input.userAgent) {
    const ua = input.userAgent.toLowerCase()
    for (const pattern of AI_USER_AGENT_PATTERNS) {
      if (ua.includes(pattern.toLowerCase())) {
        return true
      }
    }
  }

  return false
}

/**
 * 記事HTMLパス（/post/<slug>/）に対応するMarkdownパス（/post/<slug>.md）を返す。
 * 対象外のパスは null を返す。
 */
export const postMarkdownPathFor = (pathname: string): string | null => {
  // /post/ で始まらない場合は除外
  if (!pathname.startsWith("/post/")) {
    return null
  }

  // /post/ 自体は除外
  if (pathname === "/post/" || pathname === "/post") {
    return null
  }

  // 末尾スラッシュを除去して slug を取得
  const withoutTrailingSlash = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname

  // /post/ の後ろの部分を取得
  const afterPost = withoutTrailingSlash.slice("/post/".length)

  if (!afterPost) {
    return null
  }

  // 最終セグメントに . を含むパスは除外（画像や .md 等）
  const segments = afterPost.split("/")
  const lastSegment = segments[segments.length - 1]
  if (lastSegment.includes(".")) {
    return null
  }

  return `/post/${afterPost}.md`
}
