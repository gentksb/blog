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

export const a8LinkData = {
  url: "https://px.a8.net/svt/ejp?a8mat=3N3PXV+GF7GHE+45DI+BW0YB&a8ejpredirect=https%3A%2F%2Fwww.myprotein.jp%2Fsports-nutrition%2Fimpact-whey-protein%2F10530943.html",
  isA8Link: true
}

export const a8LinkDataExpectedResponse = {
  title: "Impact ホエイ プロテイン",
  imageUrl:
    "https://static.thcdn.com/images/small/original//productimg/960/960/10530943-1224889444460882.jpg",
  description:
    "\n\t\t\n\t\t\t\n\t\t\t\tImpact ホエイ プロテインを割引クーポンで超お得に購入するなら英国発マイプロテイン。一定額購入で送料無料。1食分あたり80％以上のタンパク質を含有する、英国で一番の高品質ホエイプロテインです。食欲をそそるおいしいフレーバーを50種類以上もご用意しています。\n\t\t\t\n\t\t\t\n\t\t",
  siteName: "Myprotein Japan",
  ogpIcon: "https://www.myprotein.jp/favicon.ico",
  pageurl:
    "https://px.a8.net/svt/ejp?a8mat=3N3PXV+GF7GHE+45DI+BW0YB&a8ejpredirect=https%3A%2F%2Fwww.myprotein.jp%2Fsports-nutrition%2Fimpact-whey-protein%2F10530943.html",
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
