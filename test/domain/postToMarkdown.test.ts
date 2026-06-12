import { expect, test } from "vitest"
import { postToMarkdown } from "../../src/lib/postToMarkdown"

const BASE_INPUT = {
  slug: "2013/12/jetfly-tl",
  title: "テスト記事",
  date: new Date("2013-12-01T00:00:00Z"),
  tags: ["REVIEW", "CX"],
  siteUrl: "https://blog.gensobunya.net/",
  partnerTag: "mytag-22"
}

// === frontmatter 出力 ===

test("frontmatter が正しく出力される", () => {
  const result = postToMarkdown({ ...BASE_INPUT, body: "本文" })
  expect(result).toContain('title: "テスト記事"')
  expect(result).toContain("date: 2013-12-01")
  expect(result).toContain("tags: [REVIEW, CX]")
  expect(result).toContain(
    "url: https://blog.gensobunya.net/post/2013/12/jetfly-tl/"
  )
})

test('title の " はエスケープされる', () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    title: 'He said "hello"',
    body: ""
  })
  expect(result).toContain('title: "He said \\"hello\\""')
})

test("末尾に改行1つで終わる", () => {
  const result = postToMarkdown({ ...BASE_INPUT, body: "本文" })
  expect(result.endsWith("\n")).toBe(true)
  expect(result.endsWith("\n\n")).toBe(false)
})

// === ルール1: MDXコメント除去 ===

test("MDXコメント {/* ... */} が除去される", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: "前\n{/* これはコメント */}\n後"
  })
  expect(result).not.toContain("{/*")
  expect(result).toContain("前")
  expect(result).toContain("後")
})

// === ルール2: import 文除去 ===

test("行頭 import 文が除去される", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: "import Foo from './Foo'\n本文"
  })
  expect(result).not.toContain("import Foo")
  expect(result).toContain("本文")
})

// === ルール3: Amzn → Amazon リンク ===

test("<Amzn asin='XXXX' /> が Amazon リンクに変換される（partnerTag あり）", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: '<Amzn asin="B0044BG93S" />'
  })
  expect(result).toContain(
    "[Amazonで見る (ASIN: B0044BG93S)](https://www.amazon.co.jp/dp/B0044BG93S?tag=mytag-22)"
  )
})

test("<Amzn /> partnerTag が空なら ?tag= なし", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    partnerTag: "",
    body: '<Amzn asin="B0044BG93S" />'
  })
  expect(result).toContain(
    "[Amazonで見る (ASIN: B0044BG93S)](https://www.amazon.co.jp/dp/B0044BG93S)"
  )
  expect(result).not.toContain("?tag=")
})

test("<Amzn /> 複数行属性に対応", () => {
  const body = `<Amzn
  asin="B0044BG93S"
/>`
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain(
    "[Amazonで見る (ASIN: B0044BG93S)](https://www.amazon.co.jp/dp/B0044BG93S?tag=mytag-22)"
  )
})

// === ルール4: LinkCard ===

test("<LinkCard url='...' /> が [url](url) に変換される", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: '<LinkCard url="https://example.com/page/" />'
  })
  expect(result).toContain(
    "[https://example.com/page/](https://example.com/page/)"
  )
})

test("<LinkCard url='...' linkUrl='...' /> は linkUrl を使う", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: '<LinkCard url="https://example.com/" linkUrl="https://other.com/" />'
  })
  expect(result).toContain("[https://other.com/](https://other.com/)")
})

test("<LinkCard /> 複数行属性に対応", () => {
  const body = `<LinkCard
  url="https://example.com/"
  linkUrl="https://other.com/"
/>`
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain("[https://other.com/](https://other.com/)")
})

// === ルール5: SimpleLinkCard ===

test("<SimpleLinkCard url='...' title='...' /> が [title](url) に変換される", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: '<SimpleLinkCard url="https://example.com/" title="Example Site" />'
  })
  expect(result).toContain("[Example Site](https://example.com/)")
})

test("<SimpleLinkCard url='...' /> title なし → [url](url)", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: '<SimpleLinkCard url="https://example.com/" />'
  })
  expect(result).toContain("[https://example.com/](https://example.com/)")
})

test("<SimpleLinkCard /> linkUrl あり → linkUrl を href に使う", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: '<SimpleLinkCard url="https://example.com/" title="Example" linkUrl="https://other.com/" />'
  })
  expect(result).toContain("[Example](https://other.com/)")
})

// === ルール6: PositiveBox / NegativeBox ===

test("<PositiveBox> が > 😊 引用ブロックに変換される", () => {
  const body = `<PositiveBox>
良い点です
</PositiveBox>`
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain("> 😊")
  expect(result).toContain("> 良い点です")
})

test("<PositiveBox> リスト入り", () => {
  const body = `<PositiveBox>
- 軽い
- 速い
</PositiveBox>`
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain("> 😊")
  expect(result).toContain("> - 軽い")
  expect(result).toContain("> - 速い")
})

test("<NegativeBox> が > 😞 引用ブロックに変換される", () => {
  const body = `<NegativeBox>
悪い点です
</NegativeBox>`
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain("> 😞")
  expect(result).toContain("> 悪い点です")
})

// === ルール7: 相対パス画像 ===

test("相対パス画像 ![alt](./foo.jpg) が除去される", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: "![自転車](./DSC_1455.jpg)"
  })
  expect(result).not.toContain("DSC_1455.jpg")
})

test("絶対URL画像 ![alt](https://...) は残る", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: "![自転車](https://example.com/photo.jpg)"
  })
  expect(result).toContain("![自転車](https://example.com/photo.jpg)")
})

test("http:// 画像も残る", () => {
  const result = postToMarkdown({
    ...BASE_INPUT,
    body: "![自転車](http://example.com/photo.jpg)"
  })
  expect(result).toContain("![自転車](http://example.com/photo.jpg)")
})

// === ルール8: 未知の大文字始まり JSX タグ除去 ===

test("未知の JSX タグはタグのみ除去（内容は残る）", () => {
  const body = `<CustomWidget foo="bar">
コンテンツ
</CustomWidget>`
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).not.toContain("<CustomWidget")
  expect(result).not.toContain("</CustomWidget>")
  expect(result).toContain("コンテンツ")
})

// === ルール9: 空行圧縮 ===

test("連続3行以上の空行が2行（空行1つ）に圧縮される", () => {
  const body = "段落1\n\n\n\n段落2"
  const result = postToMarkdown({ ...BASE_INPUT, body })
  // 3連続以上の \n はなくなっているはず
  expect(result).not.toMatch(/\n{3,}/)
})

// === コードフェンス内は変換しない ===

test("コードフェンス内の <Amzn /> は変換されない", () => {
  const body = '```\n<Amzn asin="B0044BG93S" />\n```'
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain('<Amzn asin="B0044BG93S" />')
  expect(result).not.toContain("Amazonで見る")
})

test("コードフェンス内の相対パス画像は除去されない", () => {
  const body = "```\n![](./a.jpg)\n```"
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain("![](./a.jpg)")
})

test("コードフェンス外は変換される、フェンス内は変換されない（混在）", () => {
  const body =
    '<Amzn asin="B0044BG93S" />\n\n```\n<Amzn asin="SKIPME" />\n```\n\n![](./img.jpg)'
  const result = postToMarkdown({ ...BASE_INPUT, body })
  expect(result).toContain("Amazonで見る (ASIN: B0044BG93S)")
  expect(result).toContain('<Amzn asin="SKIPME" />')
  expect(result).not.toContain("img.jpg")
})
