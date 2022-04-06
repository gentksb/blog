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

export const amazonLinkData = {
  url: "https://www.amazon.co.jp/dp/B004N3APGO/",
  isAmazonLink: true
}

export const amazonLinkDataExpectedResponse = {
  title: "Amazonギフト券 Eメールタイプ - Amazonベーシック",
  imageUrl: "https://m.media-amazon.com/images/I/41-4Hj2o+qL._SL500_.jpg",
  description: "Amazon.co.jpで使えるデジタル商品券",
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
