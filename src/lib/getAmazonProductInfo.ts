import type {
  AmazonItemsRequestParameters,
  AmazonItemsResponse
} from "amazon-paapi"
import { AwsClient } from "aws4fetch"
import {
  PAAPI_ACCESSKEY,
  PAAPI_SECRETKEY,
  PARTNER_TAG,
  getSecret
} from "astro:env/server"

type AmazonRequestBody = AmazonItemsRequestParameters & {
  PartnerTag: string
  PartnerType: "Associates"
  Marketplace: "www.amazon.co.jp"
}

export const getAmazonProductInfo = async (asin: string) => {
  // get Secrets
  const paapiAccesskey =
    getSecret(PAAPI_ACCESSKEY) ?? process.env.PAAPI_ACCESSKEY
  const paapiSecretkey =
    getSecret(PAAPI_SECRETKEY) ?? process.env.PAAPI_SECRETKEY
  const partnerTag = getSecret(PARTNER_TAG) ?? process.env.PARTNER_TAG

  // if secrets are not found, throw an error
  if (
    typeof paapiAccesskey !== "string" ||
    typeof paapiSecretkey !== "string" ||
    typeof partnerTag !== "string"
  ) {
    throw new Error("Environment variables are not valid")
  } else if (asin.length !== 10) {
    throw new Error("ASIN is not valid: invalid length")
  } else {
    const paapiClient = new AwsClient({
      accessKeyId: paapiAccesskey,
      secretAccessKey: paapiSecretkey,
      service: "ProductAdvertisingAPI",
      region: "us-west-2"
    })

    const body: AmazonRequestBody = {
      ItemIds: [asin],
      Resources: [
        "Images.Primary.Medium",
        "Images.Primary.Large",
        "ItemInfo.Features",
        "ItemInfo.Title"
      ],
      Condition: "New",
      ItemIdType: "ASIN",
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.co.jp"
    }
    const reqPropaties = {
      method: "POST",
      headers: {
        Accept: "application/json, text/javascript",
        "Accepet-Language": "en-US",
        "Content-Type": "application/json; charset=utf-8",
        "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
        "Content-Encoding": "amz-1.0"
      },
      body: JSON.stringify(body)
    }

    const response: Response = await paapiClient.fetch(
      "https://webservices.amazon.co.jp/paapi5/getitems",
      {
        method: reqPropaties.method,
        headers: reqPropaties.headers,
        body: reqPropaties.body
      }
    )
    console.log(`PAAPI Response status: ${response.status}`)
    const responseBody: AmazonItemsResponse = await response.json()
    console.dir(responseBody.ItemsResult.Items, { depth: null, colors: true })

    return responseBody
  }
}
