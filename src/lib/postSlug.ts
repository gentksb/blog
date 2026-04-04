/**
 * Content Layer API の entry.id から URL 用スラッグを生成
 * entry.id は "2024/09/post.mdx" のような形式
 */
export const slugFromId = (id: string): string => id.replace(/\.mdx$/, "")
