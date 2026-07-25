import { DIRECTIVES, type DirectiveName } from "./directives"

// :::positive ... ::: の1ブロック。ディレクティブ名はレジストリから生成する。
// satteri が受け付ける字下げ・コロン4個以上・開始終了のコロン数不一致・ラベル
// `[...]`・属性 `{...}`・行末の余分なテキストをすべて拾う。
// 本文が空のブロックにも対応するため、本文側のグループを省略可能にしている。
const directiveFencePattern = new RegExp(
  `^[ \\t]*:{3,}(${Object.keys(DIRECTIVES).join("|")})(?![\\w-])[^\\n]*(?:\\r?\\n([\\s\\S]*?))?\\r?\\n[ \\t]*:{3,}[^\\n]*$`,
  "gm"
)

/**
 * ディレクティブ本文を引用ブロックへ変換する。
 * 字下げされたブロックの本文はそのまま引用すると4スペース以上のインデントで
 * コードブロック扱いになるため、共通の字下げ幅を除去する。
 */
const toQuotedBlock = (content: string): string => {
  const lines = content.split("\n").map((line) => line.replace(/\r$/, ""))
  while (lines.length > 0 && lines[0].trim() === "") lines.shift()
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop()

  const indents = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.length - line.trimStart().length)
  const commonIndent = indents.length > 0 ? Math.min(...indents) : 0

  return lines
    .map((line) => line.slice(commonIndent))
    .map((line) => (line.trim() === "" ? ">" : `> ${line}`))
    .join("\n")
}

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

  // 6. コンテナディレクティブ（:::positive / :::negative）→ 絵文字付き引用ブロック
  segment = segment.replace(
    directiveFencePattern,
    (_, name: string, content: string | undefined) => {
      const prefix = DIRECTIVES[name as DirectiveName].markdownPrefix
      const quoted = toQuotedBlock(content ?? "")
      return quoted === "" ? prefix : `${prefix}\n${quoted}`
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
