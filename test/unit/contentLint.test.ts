import { expect, test } from "vitest"
import { DIRECTIVES, isDirectiveName } from "../../src/lib/directives"

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

// satteri は `::::name` / 字下げ / `:::name{...}` / `:::name[label]` / 名前直後の
// 余分なテキストも container directive として受け付けるが、postToMarkdown の変換は
// 行頭・コロン3個・名前のみの正規形しか拾わない。緩いパターンで開始行を集め、
// 正規形かつ DIRECTIVES 定義済みであることを要求する。
const directiveOpenerPattern = /^([ \t]*)(:{3,})([A-Za-z][A-Za-z0-9-]*)(.*)$/gm

test("MDXのコンテナディレクティブが正規形かつ DIRECTIVES に定義されている", () => {
  const offenders = Object.entries(allMdxSources).flatMap(([path, source]) =>
    [...source.matchAll(directiveOpenerPattern)]
      .filter(
        ([, indent, colons, name, rest]) =>
          indent !== "" ||
          colons !== ":::" ||
          rest.trim() !== "" ||
          !isDirectiveName(name)
      )
      .map(([line]) => `${path}: ${JSON.stringify(line)}`)
  )
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
