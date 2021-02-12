import * as functions from "firebase-functions"
import "firebase-functions/lib/logger/compat"
import fetch from "node-fetch"
import { JSDOM } from "jsdom"
const amazonPaapi = require("amazon-paapi")
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

interface Props {
  url: string
  isAmazonLink?: boolean
}

interface Res {
  title: string
  imageUrl: string
  description: string
  siteName: string
  ogpIcon: string
  pageurl: string
  error?: string
}

// AmazonのAPIやFetchの回数を減らすためにグローバル変数にキャッシュする
//　https://firebase.google.com/docs/functions/tips?hl=ja#use_global_variables_to_reuse_objects_in_future_invocations
const cache = new Map<string, Res>()

export const getOgpLinkData = functions
  .region("asia-northeast1")
  .https.onCall(async (data: Props, context) => {
    functions.logger.info("Url:", data.url, "isAmazon", data.isAmazonLink)

    if (cache.has(data.url)) {
      functions.logger.info("Cahe hit!", cache.get(data.url))
      return cache.get(data.url)
    }

    const result: Res = {
      title: "",
      imageUrl: "",
      description: "",
      siteName: "",
      ogpIcon: "",
      pageurl: "",
      error: "",
    }
    const urlConstructor = new URL(data.url)
    const urlDomain = urlConstructor.hostname

    if (data.isAmazonLink) {
      result.siteName = "www.amazon.co.jp"
      result.ogpIcon = "https://www.amazon.co.jp/favicon.ico"

      try {
        if (
          functions.config().amazon.paapi_key === null ||
          functions.config().amazon.paapi_secret === null ||
          functions.config().amazon.partner_tag === null
        ) {
          result.error = "Didn't set PAAPIv5 parameters"
          console.error("Didn't set PAAPIv5 parameters")
          return result
        }
        const httpResponse = await fetch(data.url)
        const html = await httpResponse.text()
        const jsdom = new JSDOM(html)
        const document = jsdom.window.document
        const asin = document.querySelector("#ASIN")?.getAttribute("value")

        const commonParameters = {
          AccessKey: functions.config().amazon.paapi_key,
          SecretKey: functions.config().amazon.paapi_secret,
          PartnerTag: functions.config().amazon.partner_tag,
          PartnerType: "Associates",
          Marketplace: "www.amazon.co.jp",
        }

        const requestParameters = {
          ItemIds: [asin],
          ItemIdType: "ASIN",
          Condition: "New",
          Resources: [
            "Images.Primary.Medium",
            "Images.Primary.Large",
            "ItemInfo.Title",
            "ItemInfo.Features",
          ],
        }

        const apiResult = await amazonPaapi.GetItems(
          commonParameters,
          requestParameters
        )
        const productDetail = apiResult.ItemsResult.Items[0]
        console.log(productDetail)

        result.pageurl = productDetail.DetailPageURL //AmazonはPAAPIで発行したURLを返す
        result.imageUrl =
          productDetail.Images.Primary.Large.URL ??
          productDetail.Images.Primary.Medium.URL
        result.title = productDetail.ItemInfo.Title.DisplayValue
        result.description =
          productDetail.ItemInfo.Features?.DisplayValues[0] ?? ""

        console.log(result)
        cache.set(data.url, result)

        return result
      } catch (error) {
        console.error(error)
        result.error = error
        return result
      }
    } else {
      try {
        const httpResponse = await fetch(data.url)
        const html = await httpResponse.text()
        const jsdom = new JSDOM(html)
        const document = jsdom.window.document
        result.pageurl = data.url //通常のOGPは渡されたURLをそのままセットする
        result.title =
          document
            .querySelector("meta[property='og:title']")
            ?.getAttribute("content") ??
          document
            .querySelector("meta[name='title']")
            ?.getAttribute("content") ??
          document.title ??
          ""
        result.imageUrl =
          document
            .querySelector("meta[property='og:image']")
            ?.getAttribute("content") ?? ""
        result.description =
          document
            .querySelector("meta[property='og:description']")
            ?.getAttribute("content") ??
          document
            .querySelector("meta[name='description']")
            ?.getAttribute("content") ??
          ""
        result.siteName =
          document
            .querySelector("meta[property='og:site_name']")
            ?.getAttribute("content") ?? urlDomain

        const siteIconPath =
          document
            .querySelector("[type='image/x-icon']")
            ?.getAttribute("href") || "/favicon.ico"
        result.ogpIcon = siteIconPath.includes("//")
          ? siteIconPath
          : `https://${urlDomain}${siteIconPath}` //絶対パスに変換

        console.log(result)
        cache.set(data.url, result)

        return result
      } catch (error) {
        console.error(error)
        result.error = error
        return result
      }
    }
  })
