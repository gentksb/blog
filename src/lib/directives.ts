/**
 * 記事 MDX のコンテナディレクティブ記法（:::positive など）の定義。
 * レンダリング経路（satteri プラグイン）と Markdown 配信経路（postToMarkdown）が
 * このファイルを参照する。
 */
export const DIRECTIVES = {
  positive: { component: "PositiveBox", markdownPrefix: "> 😊" },
  negative: { component: "NegativeBox", markdownPrefix: "> 😞" }
} as const

export type DirectiveName = keyof typeof DIRECTIVES

export const isDirectiveName = (name: string): name is DirectiveName =>
  name in DIRECTIVES
