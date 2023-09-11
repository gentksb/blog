import type { ResType } from "../src/fetcher/fetchOgp"

export const normalLinkUrl = "https://blog.gensobunya.net/"

export const normalLinkDataExpectedResponse: ResType = {
  ogpTitle: "幻想サイクル",
  ogpImageUrl: "https://blog.gensobunya.net/image/logo.jpg",
  ogpDescription:
    "AJOCC C1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです",
  ogpSiteName: "幻想サイクル",
  pageurl: "https://blog.gensobunya.net/",
  ok: true,
  error: ""
}

export const testAsin = "B004N3APGO"

export const amazonLinkDataExpectedResponse: ResType = {
  ogpTitle:
    "Amazonギフトカード (Eメールタイプ)テキストメッセージにも送信可 - Amazonベーシック",
  ogpImageUrl: "https://m.media-amazon.com/images/I/41xROrVX5kL._SL500_.jpg",
  ogpDescription: "Amazon.co.jpで使えるギフトカード(デジタルタイプ)です。",
  ogpSiteName: "www.amazon.co.jp",
  pageurl:
    "https://www.amazon.co.jp/dp/B004N3APGO?tag=gensobunya-22&linkCode=ogi&th=1&psc=1",
  ok: true,
  error: ""
}
