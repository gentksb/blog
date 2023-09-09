export const normalLinkData = {
  url: "https://blog.gensobunya.net/"
}

export const normalLinkDataExpectedResponse = {
  title: "幻想サイクル",
  imageUrl: "https://blog.gensobunya.net/image/logo.jpg",
  description:
    "AJOCC C1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです",
  siteName: "幻想サイクル",
  ogpIcon: "https://blog.gensobunya.net/favicon.ico",
  pageurl: "https://blog.gensobunya.net/",
  error: ""
}

export const amazonLinkData = "https://www.amazon.co.jp/dp/B004N3APGO/"

export const amazonLinkDataExpectedResponse = {
  title:
    "Amazonギフトカード (Eメールタイプ)テキストメッセージにも送信可 - Amazonベーシック",
  imageUrl: "https://m.media-amazon.com/images/I/41xROrVX5kL._SL500_.jpg",
  description: "Amazon.co.jpで使えるギフトカード(デジタルタイプ)です。",
  siteName: "www.amazon.co.jp",
  ogpIcon: "https://www.amazon.co.jp/favicon.ico",
  pageurl:
    "https://www.amazon.co.jp/dp/B004N3APGO?tag=gensobunya-22&linkCode=ogi&th=1&psc=1",
  error: ""
}

export const invalidAmazonAsinData = {
  url: "https://www.gensobunya.net/",
  isAmazonLink: true
}

export const invalidAmazonAsinDataResponse = {
  message: "ASIN not found in URL",
  status: "INVALID_ARGUMENT"
}
