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
// https://firebase.google.com/docs/functions/tips?hl=ja#use_global_variables_to_reuse_objects_in_future_invocations
const cache = new Map<string, Res>()

const amazonPaApiKey = functions.config().amazon.paapi_key
const amazonPaApiSecret = functions.config().amazon.paapi_secret
const amazonPaApiPartnerTag = functions.config().amazon.partner_tag

const commonParameters = {
  AccessKey: amazonPaApiKey,
  SecretKey: amazonPaApiSecret,
  PartnerTag: amazonPaApiPartnerTag,
  PartnerType: "Associates",
  Marketplace: "www.amazon.co.jp"
}

export const getOgpLinkData = functions
  .region("asia-northeast1")
  .https.onCall(async (data: Props, context) => {
    functions.logger.info("Url:", data.url, "isAmazon", data.isAmazonLink)
    if (data.url === undefined) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No url parameter"
      )
    }

    if (cache.has(data.url)) {
      functions.logger.info("Cache hit!", cache.get(data.url))
      return cache.get(data.url)
    }

    const result: Res = {
      title: "",
      imageUrl: "",
      description: "",
      siteName: "",
      ogpIcon: "",
      pageurl: "",
      error: ""
    }
    const urlConstructor = new URL(data.url)
    const urlDomain = urlConstructor.hostname

    if (data.isAmazonLink) {
      result.siteName = "www.amazon.co.jp"
      result.ogpIcon = "https://www.amazon.co.jp/favicon.ico"

      if (
        amazonPaApiKey === null ||
        amazonPaApiSecret === null ||
        amazonPaApiPartnerTag === null
      ) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Didn't set PAAPIv5 parameters"
        )
      }

      const getAsinFromUrl = (url: string) => {
        return new Promise((resolve) => {
          const re = RegExp(/[^0-9A-Z]([0-9A-Z]{10})([^0-9A-Z]|$)/)
          const hitData = re.exec(url)
          if (hitData !== null) {
            resolve(hitData[1])
          } else {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "ASIN not found in URL"
            )
          }
        })
      }
      const asin = await getAsinFromUrl(data.url)
      console.log("asin is", asin)

      const requestParameters = {
        ItemIds: [asin],
        ItemIdType: "ASIN",
        Condition: "New",
        Resources: [
          "Images.Primary.Medium",
          "Images.Primary.Large",
          "ItemInfo.Title",
          "ItemInfo.Features"
        ]
      }

      // eslint-disable-next-line
      const callPaapi = async () => {
        for (let retrycount = 0; retrycount < 3; retrycount++) {
          try {
            return await amazonPaapi.GetItems(
              commonParameters,
              requestParameters
            )
          } catch (error) {
            if (error.status === 429 && retrycount < 2) {
              const backoffSleep = (retrycount + 1) ** 2 * 1000
              const sleep = (msec: number) =>
                new Promise((resolve) => setTimeout(resolve, msec))
              await sleep(backoffSleep)
              console.log("retry")
            } else {
              console.error(error)
              throw new functions.https.HttpsError("internal", error)
            }
          }
        }
      }

      const apiResult = await callPaapi()

      try {
        const productDetail = apiResult.ItemsResult.Items[0]
        console.log(productDetail)

        result.pageurl = productDetail.DetailPageURL // AmazonはPAAPIで発行したURLを返す
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
        throw new functions.https.HttpsError("internal", error)
      }
    } else {
      try {
        const getHtmlDocument = async (url: string) => {
          const httpResponse = await fetch(url)
          const html = await httpResponse.text()
          const jsdom = new JSDOM(html)
          return jsdom.window.document
        }
        const document = await getHtmlDocument(data.url)
        result.pageurl = data.url // 通常のOGPは渡されたURLをそのままセットする
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
          : `https://${urlDomain}${siteIconPath}` // 絶対パスに変換

        console.log(result)
        cache.set(data.url, result)

        return result
      } catch (error) {
        console.error(error)
        throw new functions.https.HttpsError("internal", error)
      }
    }
  })
