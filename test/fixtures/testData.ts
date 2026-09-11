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

// normalLinkDataExpectedResponse に対応する OGP タグを含む HTML フィクスチャ。
// fetch をスタブして HTMLRewriter のパース結果を検証するために利用する
// （本番ドメインへの実ネットワークアクセスを避け、bot 対策の影響を受けないようにする）。
export const normalLinkOgpHtml = `<!DOCTYPE html>
<html>
<head>
  <title>幻想サイクル</title>
  <meta property="og:title" content="幻想サイクル">
  <meta property="og:image" content="https://blog.gensobunya.net/image/logo.jpg">
  <meta property="og:description" content="AJOCC ME1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです">
  <meta property="og:site_name" content="幻想サイクル">
</head>
<body></body>
</html>`

export const testAsin = "B004N3APGO"
