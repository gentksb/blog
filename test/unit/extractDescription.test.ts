import { expect, test } from "vitest"
import { extractDescription } from "../../src/lib/extractDescription"
import { postMdxSources, stripFrontmatter } from "../helpers/mdxSources"

// ディレクティブ行は名前を読まず /^[ \t]*:{3,}.*$/gm の1本で落としている。
// 字下げ・コロン数・行末の付随要素（属性/ラベル/余分なテキスト）をまとめて確認する
test.each([
  { name: "基本形", source: ":::positive\n本文テキスト\n:::" },
  {
    name: "字下げ・コロン4個・属性付き",
    source: "  ::::positive{.tight} 余分なテキスト\n  本文テキスト\n  :::"
  }
])(
  "コンテナディレクティブ($name)の記法が description に残らない",
  ({ source }) => {
    const description = extractDescription(source)
    expect(description).not.toContain(":::")
    expect(description).toBe("本文テキスト")
  }
)

test("コードフェンス内の記号が description に残らない", () => {
  const source = [
    "```js",
    'const a = "**強調** - 箇条書き :::positive <Tag>"',
    "```",
    "",
    "本文テキスト"
  ].join("\n")
  expect(extractDescription(source)).toBe("本文テキスト")
})

// 強調除去がコードフェンス除去より先に走ると、フェンス内の単独の * が
// 本文側の ** と対になって文章を壊す
test("コードフェンス内の単独アスタリスクが本文の強調除去を壊さない", () => {
  const source = ["```", "a * b", "```", "", "**強調**テキスト"].join("\n")
  expect(extractDescription(source)).toBe("強調テキスト")
})

test("インラインコード内の記号が description に残らない", () => {
  const source = "設定は `foo *bar* _baz_` で行う"
  expect(extractDescription(source)).toBe("設定は で行う")
})

test("見出し・箇条書き・引用の行頭記号を除去して本文だけ残す", () => {
  const source = [
    "## 見出し",
    "",
    "- ハイフン",
    "* アスタリスク",
    "+ プラス",
    "1. 番号付き",
    "  - 字下げ",
    "",
    "> 引用文"
  ].join("\n")
  const description = extractDescription(source)
  expect(description).toBe(
    "見出し ハイフン アスタリスク プラス 番号付き 字下げ 引用文"
  )
})

test("水平線を除去しつつ箇条書きのハイフンは箇条書きとして扱う", () => {
  expect(extractDescription("---\n\n- 項目\n\n***\n\n本文")).toBe("項目 本文")
})

test("画像を除去しリンクはテキストだけ残す", () => {
  const source = [
    "![代替テキスト](./cover.jpg)",
    "",
    "[Wahoo KICKR CORE2(Zwift Cog)](https://amzn.to/4fcKKLR)を使っていた。"
  ].join("\n")
  expect(extractDescription(source)).toBe(
    "Wahoo KICKR CORE2(Zwift Cog)を使っていた。"
  )
})

test("MDXコンポーネントとHTMLタグを除去する", () => {
  const source = [
    '<Amzn asin="B0FKFT46BG" />',
    "<LinkCard",
    '  url="https://example.com/"',
    "/>",
    "<Foo>中身も消える</Foo>",
    '<img border="0" src="./DSC_1568.jpg" width="640" />',
    "",
    "本文テキスト"
  ].join("\n")
  expect(extractDescription(source)).toBe("本文テキスト")
})

test("タグではない不等号と識別子の下線を壊さない", () => {
  expect(extractDescription("3<4 は真。DSC_1500.jpg を参照。")).toBe(
    "3<4 は真。DSC_1500.jpg を参照。"
  )
})

// タグ除去の [^<>] が [^>] だと、本文の < から後続タグの /> までを一括で飲み込む
test("大文字が続く不等号の後ろにタグがあっても本文を飲み込まない", () => {
  const source = ["A<B の比較。", "", '<Amzn asin="X" />', "", "本文"].join(
    "\n"
  )
  expect(extractDescription(source)).toBe("A<B の比較。 本文")
})

// 除去前に切り詰めると、除去後に description が空になる
test("長いコードフェンスの後ろにある本文から maxLength ぶん取れる", () => {
  const source = ["```", "x".repeat(3000), "```", "あ".repeat(200)].join("\n")
  const description = extractDescription(source)
  expect(description).toHaveLength(100)
  expect(description.startsWith("あ")).toBe(true)
})

test("maxLength を超えない", () => {
  const source = "あ".repeat(500)
  expect(extractDescription(source)).toHaveLength(100)
  expect(extractDescription(source, 200)).toHaveLength(200)
})

const descriptions: Array<[string, string]> = Object.entries(
  postMdxSources
).map(([path, source]) => [path, extractDescription(stripFrontmatter(source))])

// 行頭 # は本文中の #1（レース番号）と区別できないため検査対象から外す
const residualPatterns = [
  { name: "コンテナディレクティブ", pattern: /:::/ },
  { name: "箇条書き", pattern: /(^|\s)- / },
  { name: "強調", pattern: /\*\*/ },
  { name: "タグ", pattern: /<\/?[A-Za-z]/ }
]

test.each(residualPatterns)(
  "全記事の description に $name の記法が残らない",
  ({ pattern }) => {
    const offenders = descriptions
      .filter(([, description]) => pattern.test(description))
      .map(([path, description]) => `${path}: ${JSON.stringify(description)}`)
    expect(offenders).toEqual([])
  }
)

test("全記事の description が空にならない", () => {
  const offenders = descriptions
    .filter(([, description]) => description.length === 0)
    .map(([path]) => path)
  expect(offenders).toEqual([])
})
