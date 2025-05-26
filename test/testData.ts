import type { OgpData } from "@type/ogpData-type"

export const normalLinkUrl = "https://blog.gensobunya.net/"

export const normalLinkDataExpectedResponse: OgpData = {
  ogpTitle: "幻想サイクル",
  ogpImageUrl: "https://blog.gensobunya.net/image/logo.jpg",
  ogpDescription:
    "AJOCC ME1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです",
  ogpSiteName: "幻想サイクル",
  pageurl: "https://blog.gensobunya.net/",
  ok: true
}

// Todo: テストパターン追加「og:titleとtitleタグ情報が異なる」
// Todo: テストパターン追加「og:titleがなくtitleタグ情報で出力」
// 上記2つのdescription版

export const testAsin = "B004N3APGO"
