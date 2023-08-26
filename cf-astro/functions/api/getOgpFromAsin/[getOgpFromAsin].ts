import { AmazonItemsRequestParameters } from "amazon-paapi"
import { AwsClient } from "aws4fetch"
interface ENV {
  PAAPI_ACCESSKEY: string
  PAAPI_SECRETKEY: string
  PARTNER_TAG: string
}

type AmazonRequestBody = AmazonItemsRequestParameters & {
  PartnerTag: string
  PartnerType: "Associates"
  Marketplace: "www.amazon.co.jp"
}

export const onRequest: PagesFunction<ENV> = async (context) => {
  if (typeof context.params.getOgpFromAsin !== "string") {
    return new Response("Parameter is not a single string", { status: 400 })
  } else {
    const asin = context.params.getOgpFromAsin
    console.log(`Start function with ASIN:${asin}`)

    // check context.env for PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG
    if (
      typeof context.env.PAAPI_ACCESSKEY !== "string" ||
      typeof context.env.PAAPI_SECRETKEY !== "string" ||
      typeof context.env.PARTNER_TAG !== "string"
    ) {
      return new Response("Environment variables are not valid", {
        status: 500
      })
    } else {
      const paapiClient = new AwsClient({
        accessKeyId: context.env.PAAPI_ACCESSKEY,
        secretAccessKey: context.env.PAAPI_SECRETKEY,
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
        PartnerTag: context.env.PARTNER_TAG,
        PartnerType: "Associates",
        Marketplace: "www.amazon.co.jp"
      }
      const reqPropaties = {
        method: "POST",
        headers: {
          Accept: "application/json, text/javascript",
          "Accepet-Language": "en-US",
          "Content-Type": "application/json; charset=utf-8",
          "X-Amz-Target":
            "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
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
      console.log(`Response status: ${response.status}`)
      response.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`)
      })

      return new Response(await response.arrayBuffer())
    }
  }
}
