import * as functions from "firebase-functions"
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

export const getOgpLinkData = functions
  .region("asia-northeast1")
  .https.onCall(async (data: Props, context) => {
    functions.logger.info("Url:", data.url, "isAmazon", data.isAmazonLink)
    const result = {
      title: "",
      imageUrl: "",
      description: "",
      siteName: "",
      ogpIcon: "",
      error: "",
    }
    const urlConstructor = new URL(data.url)
    const urlDomain = urlConstructor.hostname

    if (data.isAmazonLink) {
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
          Marketplace: "Japan",
          Host: "webservices.amazon.co.jp",
          Region: "us-west-2",
        }

        const requestParameters = {
          ASIN: asin,
          Condition: "New",
          Resources: [
            "Images.Primary.Medium",
            "ItemInfo.Title",
            "Offers.Listings.Price",
          ],
        }

        amazonPaapi
          .GetItems(commonParameters, requestParameters)
          .then((data: any) => {
            // do something with the success response.
            console.log(data)
          })
          .catch((error: any) => {
            // catch an error.
            console.log(error)
          })

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
        result.title =
          document
            .querySelector("meta[property='og:title']")
            ?.getAttribute("content") ??
          document
            .querySelector("meta[name='title']")
            ?.getAttribute("content") ??
          document.querySelector("title")?.innerText ??
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

        return result
      } catch (error) {
        console.error(error)
        result.error = error
        return result
      }
    }
  })
