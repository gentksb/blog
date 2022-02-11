import functions from "firebase-functions"
import "firebase-functions/lib/logger/compat"
import fetch from "node-fetch"
import { JSDOM } from "jsdom"
import amazonPaapi from "amazon-paapi"
import queryString from "query-string"
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

interface Props {
  url: string
  isAmazonLink?: boolean
  isA8Link?: boolean
}

export interface ResType {
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
const cache = new Map<string, ResType>()

const getAsinFromUrl = (url: string) => {
  const re = RegExp(/[^0-9A-Z]([0-9A-Z]{10})([^0-9A-Z]|$)/)
  const hitData = re.exec(url)
  if (hitData !== null) {
    return hitData[1]
  } else {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "ASIN not found in URL"
    )
  }
}

const getRedirectionUrl = (url: string) => {
  //sample: https://px.a8.net/svt/ejp?a8mat=3N3PXW+IGGJ6+4JDO+BW0YB&a8ejpredirect=https%3A%2F%2Fonline.ysroad.co.jp%2Fshop%2Fg%2Fg0012527018642%2F)
  const queryObject = queryString.parseUrl(url)
  const redirectUrl = queryObject.query.a8ejpredirect
  if (typeof redirectUrl === "string") {
    return decodeURIComponent(redirectUrl)
  } else {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "invalid A8 affiliate URL"
    )
  }
}

export const getOgpLinkData = functions
  .region("asia-northeast1")
  .https.onCall(async (data: Props, context) => {
    const amazonPaApiKey = functions.config().amazon.paapi_key
    const amazonPaApiSecret = functions.config().amazon.paapi_secret
    const amazonPaApiPartnerTag = functions.config().amazon.partner_tag

    functions.logger.info(
      "Url:",
      data.url,
      "isAmazon",
      data.isAmazonLink,
      "isA8",
      data.isA8Link
    )
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

    const result: ResType = {
      title: "",
      imageUrl: "",
      description: "",
      siteName: "",
      ogpIcon: "",
      pageurl: "",
      error: ""
    }
    const ogpTargetUrl = data.isA8Link ? getRedirectionUrl(data.url) : data.url
    const urlConstructor = new URL(ogpTargetUrl)
    const urlDomain = urlConstructor.hostname
    const urlProtocol = urlConstructor.protocol

    if (data.isAmazonLink) {
      result.siteName = "www.amazon.co.jp"
      result.ogpIcon = "https://www.amazon.co.jp/favicon.ico"

      const asin = await getAsinFromUrl(ogpTargetUrl)
      console.log("asin is", asin)

      const callPaapi = async () => {
        if (
          typeof amazonPaApiKey !== "string" ||
          typeof amazonPaApiSecret !== "string" ||
          typeof amazonPaApiPartnerTag !== "string" ||
          typeof asin !== "string"
        ) {
          console.log(
            "types:",
            typeof amazonPaApiKey,
            typeof amazonPaApiSecret,
            typeof amazonPaApiPartnerTag,
            typeof asin
          )
          throw new functions.https.HttpsError(
            "failed-precondition",
            "Didn't set or invalid PAAPIv5 parameters"
          )
        } else {
          for (let retrycount = 0; retrycount < 3; retrycount++) {
            try {
              return await amazonPaapi.GetItems(
                {
                  AccessKey: amazonPaApiKey,
                  SecretKey: amazonPaApiSecret,
                  PartnerTag: amazonPaApiPartnerTag,
                  PartnerType: "Associates",
                  Marketplace: "www.amazon.co.jp"
                },
                {
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
              )
            } catch (error: any) {
              if (error.status === 429 && retrycount < 2) {
                const backoffSleep = (retrycount + 1) ** 2 * 1000
                const sleep = (msec: number) =>
                  new Promise((resolve) => setTimeout(resolve, msec))
                await sleep(backoffSleep)
                console.log("retry")
              } else {
                console.error(error)
                console.error("INPUT: ", data)
                throw new functions.https.HttpsError("internal", error)
              }
            }
          }
          console.error("INPUT: ", data)
          throw new functions.https.HttpsError(
            "internal",
            "Backoff loop had done, but nothing happened"
          )
        }
      }

      const apiResult = await callPaapi()

      try {
        if (apiResult !== undefined) {
          const productDetail = apiResult.ItemsResult.Items[0]
          console.log(productDetail)

          result.pageurl = productDetail.DetailPageURL // AmazonはPAAPIで発行したURLを返す
          result.imageUrl =
            productDetail.Images?.Primary?.Large?.URL ??
            productDetail.Images?.Primary?.Medium?.URL ??
            ""
          result.title = productDetail.ItemInfo.Title?.DisplayValue ?? ""
          result.description =
            productDetail.ItemInfo.Features?.DisplayValues[0] ?? ""

          console.log(result)
          cache.set(data.url, result)

          return result
        }
      } catch (error: any) {
        console.error(error)
        console.error("INPUT: ", data)
        throw new functions.https.HttpsError(
          "internal",
          "PAAPI result parse failed"
        )
      }
    } else {
      try {
        const getHtmlDocument = async (url: string) => {
          const httpResponse = await fetch(url)
          const html = await httpResponse.text()
          const jsdom = new JSDOM(html)
          return jsdom.window.document
        }
        const document = await getHtmlDocument(ogpTargetUrl)
        result.pageurl = decodeURI(data.url) // 通常のOGPは渡されたURLをそのままセットする
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
          : siteIconPath.charAt(0) === "/"
          ? `${urlProtocol}//${urlDomain}${siteIconPath}`
          : `${urlProtocol}//${urlDomain}/${siteIconPath}` // 絶対パスに変換

        console.log(result)
        cache.set(data.url, result)

        return result
      } catch (error: any) {
        console.error(error)
        console.error("INPUT: ", data)
        throw new functions.https.HttpsError(
          "internal",
          "Webpage data parse failed"
        )
      }
    }
    throw new functions.https.HttpsError(
      "internal",
      "Complete functions, but nothing happened"
    )
  })
