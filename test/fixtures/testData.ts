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

// Additional test data for edge cases
export const invalidAsins = [
  "B004N3APG", // 9 characters
  "B004N3APGO1", // 11 characters  
  "B004N3APGo", // lowercase
  "B004-N3APG", // special character
  "B004 N3APG", // space
  "", // empty
  "あいうえおかきくけこ" // non-ASCII
]

export const validAsins = [
  "B004N3APGO", 
  "1234567890", 
  "ABCDEFGHIJ",
  "A1B2C3D4E5"
]

export const malformedUrls = [
  "not-a-url",
  "ftp://invalid-protocol.com", 
  "javascript:alert('xss')",
  "data:text/html,<script>alert('xss')</script>",
  "http://",
  "https://"
]

export const testAsin = "B004N3APGO"
