/**
 * MDX の生テキストから説明文を抽出する
 * - フロントマター、Markdownシンタックス、MDXコンポーネントを除去
 */
export function extractDescription(mdxBody: string, maxLength = 100): string {
  return (
    mdxBody
      // 正規表現処理前に早期トランケートして処理量を削減
      .slice(0, maxLength * 15)
      // MDXコンポーネント（自己閉じタグ）を除去
      .replace(/<[A-Z][^>]*\/>/g, "")
      // MDXコンポーネント（ブロックタグ）を除去
      .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "")
      // 見出し（#）を除去
      .replace(/^#{1,6}\s+/gm, "")
      // 画像を除去
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // リンクのテキストだけ残す
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // 太字・斜体を除去
      .replace(/\*{1,2}([^*]*)\*{1,2}/g, "$1")
      .replace(/_{1,2}([^_]*)_{1,2}/g, "$1")
      // コードブロックを除去
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`]*`/g, "")
      // HTMLタグを除去
      .replace(/<[^>]+>/g, "")
      // 空行を単一改行にまとめる
      .replace(/\n{2,}/g, " ")
      // 改行をスペースに変換
      .replace(/\n/g, " ")
      // 連続スペースを整理
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength)
  )
}
