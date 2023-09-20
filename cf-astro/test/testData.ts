// import type { AmazonItemsResponse } from "amazon-paapi"
import type { ResType } from "../src/util/fetcher/fetchOgp"

export const normalLinkUrl = "https://blog.gensobunya.net/"

export const normalLinkDataExpectedResponse: ResType = {
  ogpTitle: "幻想サイクル",
  ogpImageUrl: "https://blog.gensobunya.net/image/logo.jpg",
  ogpDescription:
    "AJOCC C1レーサーによるロード・MTB・CXの機材運用やレビュー、時々レースレポートを書くブログです",
  ogpSiteName: "幻想サイクル",
  pageurl: "https://blog.gensobunya.net/",
  ok: true
}

export const testAsin = "B004N3APGO"

// A part of AmazonItemsResponse Type
export const amazonLinkDataExpectedResponse = {
  ItemsResult: {
    Items: [
      {
        ASIN: testAsin,
        DetailPageURL:
          "https://www.amazon.co.jp/dp/B004N3APGO?tag=gensobunya-22&linkCode=ogi&th=1&psc=1",
        ItemInfo: {
          Title: {
            DisplayValue:
              "Amazonギフトカード (Eメールタイプ)テキストメッセージにも送信可 - Amazonベーシック",
            Label: "Title",
            Locale: "ja_JP"
          }
        },
        Images: {
          Primary: {
            Large: {
              URL: "https://m.media-amazon.com/images/I/41xROrVX5kL._SL500_.jpg"
            },
            Medium: {
              URL: "https://m.media-amazon.com/images/I/41xROrVX5kL._SL160_.jpg"
            }
          }
        }
      }
    ]
  }
}
