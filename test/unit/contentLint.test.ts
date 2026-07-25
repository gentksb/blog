import { expect, test } from "vitest"
import { DIRECTIVES, isDirectiveName } from "../../src/lib/directives"
import { postToMarkdown } from "../../src/lib/postToMarkdown"

// ビルド時(Vite)に全MDXソースを取り込む（workerd内ではfsを使えないため）
const mdxSources = import.meta.glob("../../src/content/post/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>

// ディレクティブは post / singlePage 双方のレンダリング経路で解決されるため両方を対象にする
const allMdxSources = {
  ...mdxSources,
  ...(import.meta.glob("../../src/content/singlePage/**/*.mdx", {
    query: "?raw",
    import: "default",
    eager: true
  }) as Record<string, string>)
}

test("MDXコンテンツを1件以上読み込めている", () => {
  expect(Object.keys(mdxSources).length).toBeGreaterThan(0)
})

test("singlePageのMDXコンテンツも読み込めている", () => {
  expect(Object.keys(allMdxSources).length).toBeGreaterThan(
    Object.keys(mdxSources).length
  )
})

test("LinkCardのprop誤記（小文字linkurl=）がMDXコンテンツに存在しない", () => {
  const offenders = Object.entries(mdxSources)
    .filter(([, source]) => /\blinkurl=/.test(source))
    .map(([path]) => path)
  expect(offenders).toEqual([])
})

const stripCodeFences = (source: string): string =>
  source.replace(/```[\s\S]*?```/g, "")

const stripFrontmatter = (source: string): string =>
  source.replace(/^---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n/, "")

// satteri は字下げ・コロン4個以上・ラベル・属性も container directive として
// 受け付けるため、開始行の検出は緩いパターンで行う。終了行には名前がないので
// このパターンとは重複しない
const directiveOpenerPattern = /^[ \t]*:{3,}([A-Za-z][\w-]*)/gm

test("MDXで使われているディレクティブ名が DIRECTIVES に定義されている", () => {
  const offenders = Object.entries(allMdxSources).flatMap(([path, source]) =>
    [...stripCodeFences(source).matchAll(directiveOpenerPattern)]
      .filter(([, name]) => !isDirectiveName(name))
      .map(([line]) => `${path}: ${JSON.stringify(line)}`)
  )
  expect(offenders).toEqual([])
})

// postToMarkdown はネストと閉じ忘れを変換できない。記法を禁止する代わりに、
// 実際の記事を変換して ::: が残らないことで変換漏れを検出する
test("全MDXを postToMarkdown で変換して ::: が残らない", () => {
  const offenders = Object.entries(allMdxSources)
    .map(([path, source]) => ({
      path,
      markdown: postToMarkdown({
        slug: "test/slug",
        title: "テスト",
        date: new Date("2020-01-01T00:00:00Z"),
        tags: ["TEST"],
        body: stripFrontmatter(source),
        siteUrl: "https://example.com/",
        partnerTag: ""
      })
    }))
    // コードフェンス内の ::: は変換対象外なので除外する
    .filter(({ markdown }) => stripCodeFences(markdown).includes(":::"))
    .map(({ path }) => path)
  expect(offenders).toEqual([])
})

test("PositiveBox / NegativeBox がMDXでJSX記法として書かれていない", () => {
  const componentNames = Object.values(DIRECTIVES).map((d) => d.component)
  const offenders = Object.entries(allMdxSources).flatMap(([path, source]) =>
    componentNames
      .filter((name) => new RegExp(`<${name}[\\s/>]`).test(source))
      .map((name) => `${path}: <${name}>`)
  )
  expect(offenders).toEqual([])
})
