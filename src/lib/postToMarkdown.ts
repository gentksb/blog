interface PostToMarkdownInput {
  slug: string
  title: string
  date: Date
  tags: string[]
  body: string
  siteUrl: string // 例 "https://blog.gensobunya.net/"
  partnerTag: string // 空文字なら ?tag= を付けない
}

/**
 * MDXのコードフェンス（```）で囲まれた部分とそれ以外に分割する。
 * 偶数インデックス（0, 2, ...）がフェンス外、奇数インデックスがフェンス内。
 */
const splitByCodeFences = (body: string): string[] => {
  return body.split(/(```[\s\S]*?```)/g)
}

/**
 * フェンス外のセグメントにMDX→Markdown変換を適用する。
 */
const transformSegment = (segment: string, partnerTag: string): string => {
  // 1. MDXコメント {/* ... */} を除去
  segment = segment.replace(/\{\/\*[\s\S]*?\*\/\}/g, "")

  // 2. 行頭 import ... from ... 行を除去
  segment = segment.replace(/^import\s+.*?from\s+['"].*?['"]\s*;?\s*$/gm, "")

  // 3. <Amzn asin="XXXX" /> → Amazon リンク
  segment = segment.replace(
    /<Amzn[^>]*?asin="([^"]+)"[^>]*?\/>/gs,
    (_, asin) => {
      const tag = partnerTag ? `?tag=${partnerTag}` : ""
      return `[Amazonで見る (ASIN: ${asin})](https://www.amazon.co.jp/dp/${asin}${tag})`
    }
  )

  // 4. <LinkCard ... /> → [<href>](<href>)
  segment = segment.replace(/<LinkCard\s([\s\S]*?)\/>/gs, (_, attrs) => {
    const urlMatch = attrs.match(/\burl="([^"]+)"/)
    const href = urlMatch ? urlMatch[1] : ""
    if (!href) return ""
    return `[${href}](${href})`
  })

  // 5. <SimpleLinkCard ... /> → [<text>](<href>)
  segment = segment.replace(/<SimpleLinkCard\s([\s\S]*?)\/>/gs, (_, attrs) => {
    const titleMatch = attrs.match(/\btitle="([^"]+)"/)
    const urlMatch = attrs.match(/\burl="([^"]+)"/)
    const href = urlMatch ? urlMatch[1] : ""
    const text = titleMatch ? titleMatch[1] : href
    if (!href) return ""
    return `[${text}](${href})`
  })

  // 6. <PositiveBox>内容</PositiveBox> → 引用ブロック（> 😊）
  segment = segment.replace(
    /<PositiveBox>([\s\S]*?)<\/PositiveBox>/g,
    (_, content) => {
      const trimmed = content.trim()
      const lines = trimmed.split("\n")
      const quoted = lines.map((line) =>
        line.trim() === "" ? ">" : `> ${line}`
      )
      return `> 😊\n${quoted.join("\n")}`
    }
  )

  // <NegativeBox>内容</NegativeBox> → 引用ブロック（> 😞）
  segment = segment.replace(
    /<NegativeBox>([\s\S]*?)<\/NegativeBox>/g,
    (_, content) => {
      const trimmed = content.trim()
      const lines = trimmed.split("\n")
      const quoted = lines.map((line) =>
        line.trim() === "" ? ">" : `> ${line}`
      )
      return `> 😞\n${quoted.join("\n")}`
    }
  )

  // 7. 相対パス画像を除去（http:// / https:// で始まらないもの）
  segment = segment.replace(/!\[[^\]]*\]\((?!https?:\/\/)([^)]*)\)/g, "")

  // 8. 未知の大文字始まりJSXタグを除去（子コンテンツは残す）
  // 自己閉じタグ: <Foo ... />
  segment = segment.replace(/<[A-Z][A-Za-z0-9]*(?:\s[\s\S]*?)?\/>/gs, "")
  // 開きタグ: <Foo ...>
  segment = segment.replace(/<[A-Z][A-Za-z0-9]*(?:\s[\s\S]*?)?>(?!\/)/gs, "")
  // 閉じタグ: </Foo>
  segment = segment.replace(/<\/[A-Z][A-Za-z0-9]*>/g, "")

  return segment
}

/**
 * 連続3行以上の空行を2行（空行1つ）に圧縮する。
 */
const compressBlankLines = (text: string): string => {
  return text.replace(/\n{3,}/g, "\n\n")
}

export const postToMarkdown = (input: PostToMarkdownInput): string => {
  const { slug, title, date, tags, body, siteUrl, partnerTag } = input

  // タイトルのダブルクォートをエスケープ
  const escapedTitle = title.replace(/"/g, '\\"')

  // 日付フォーマット YYYY-MM-DD
  const dateStr = date.toISOString().slice(0, 10)

  // タグリスト
  const tagsStr = tags.join(", ")

  // サイトURLの末尾スラッシュを確保
  const siteBase = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`

  const frontmatter = `---
title: "${escapedTitle}"
date: ${dateStr}
tags: [${tagsStr}]
url: ${siteBase}post/${slug}/
---`

  // フェンスで分割して変換
  const segments = splitByCodeFences(body)
  const transformed = segments
    .map((segment, index) => {
      // 奇数インデックス = コードフェンス内 → 変換しない
      if (index % 2 === 1) {
        return segment
      }
      return transformSegment(segment, partnerTag)
    })
    .join("")

  // 空行圧縮 → trim → 末尾改行
  const body_result = compressBlankLines(transformed).trim() + "\n"

  return `${frontmatter}\n\n${body_result}`
}
