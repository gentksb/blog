import type {
  AmazonItemsRequestParameters,
  AmazonItemsResponse
} from "amazon-paapi"
import { AwsClient } from "aws4fetch"

type AmazonRequestBody = AmazonItemsRequestParameters & {
  PartnerTag: string
  PartnerType: "Associates"
  Marketplace: "www.amazon.co.jp"
}

export const getAmazonProductInfo = async (asin: string) => {
  // check process.env for PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG
  if (
    typeof process.env.PAAPI_ACCESSKEY !== "string" ||
    typeof process.env.PAAPI_SECRETKEY !== "string" ||
    typeof process.env.PARTNER_TAG !== "string"
  ) {
    throw new Error("Environment variables are not valid")
  } else if (asin.length !== 10) {
    throw new Error("ASIN is not valid: invalid length")
  } else {
    const paapiClient = new AwsClient({
      accessKeyId: process.env.PAAPI_ACCESSKEY,
      secretAccessKey: process.env.PAAPI_SECRETKEY,
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
      PartnerTag: process.env.PARTNER_TAG,
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

    const response = await paapiClient.fetch(
      "https://webservices.amazon.co.jp/paapi5/getitems",
      {
        method: reqPropaties.method,
        headers: reqPropaties.headers,
        body: reqPropaties.body
      }
    )
    console.log(`PAAPI Response status: ${response.status}`)
    const responseBody: AmazonItemsResponse = await response.json()
    console.dir(responseBody.ItemsResult.Items)

    return responseBody
  }
}
