export const prerender = true

import { timeOrderPosts as posts } from "@lib/timeOrderPosts"
import { slugFromId } from "@lib/postSlug"
import { SITE_TITLE, SITE_URL } from "~/consts"

const SITE_DESCRIPTION_LLMS =
  "自転車（ロード・シクロクロス・グラベル・MTB）のレビューとレースレポートを中心とした個人ブログ。各記事は URL 末尾の `/` を `.md` に変えると Markdown で取得できます。"

export function GET() {
  const lines: string[] = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION_LLMS}`,
    "",
    "## 記事一覧",
    ""
  ]

  for (const post of posts) {
    const slug = slugFromId(post.id)
    const dateStr = post.data.date.toISOString().slice(0, 10)
    const tagsStr = post.data.tags.join(", ")
    lines.push(
      `- [${post.data.title}](${SITE_URL}post/${slug}.md): ${dateStr} / ${tagsStr}`
    )
  }

  lines.push("")

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  })
}
