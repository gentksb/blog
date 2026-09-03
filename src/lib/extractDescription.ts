/**
 * MDX の生テキストから説明文を抽出する
 * - Markdown 記法・コンテナディレクティブ・MDX コンポーネントを除去して平文にする
 */
export function extractDescription(mdxBody: string, maxLength = 100): string {
  return (
    mdxBody
      // フェンス内の記号を後続の除去規則に晒さないため最初に落とす
      .replace(/```[\s\S]*?```/g, "")
      // satteri は字下げ・コロン4個以上・ラベル・属性・行末の余分なテキストも
      // 受け付ける。名前を列挙せず ::: で始まる行ごと落として全変種を吸収する
      .replace(/^[ \t]*:{3,}.*$/gm, "")
      .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
      .replace(/^[ \t]*([-*_])(?:[ \t]*\1){2,}[ \t]*\r?$/gm, "")
      .replace(/^[ \t]*(?:[-*+]|\d+\.)[ \t]+/gm, "")
      .replace(/^[ \t]*>[ \t]?/gm, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // 強調より先に落とす。コード内の * や _ を強調の対で拾わせないため
      .replace(/`[^`\n]*`/g, "")
      .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, "$1")
      // 前後が英数字なら DSC_1500.jpg のような識別子とみなして触らない
      .replace(/(?<![A-Za-z0-9])_{1,3}([^_\n]+)_{1,3}(?![A-Za-z0-9])/g, "$1")
      .replace(/<[A-Z][^<>]*\/>/g, "")
      .replace(/<([A-Z][\w.]*)[^<>]*>[\s\S]*?<\/\1>/g, "")
      .replace(/<\/?[A-Za-z][^<>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength)
  )
}
