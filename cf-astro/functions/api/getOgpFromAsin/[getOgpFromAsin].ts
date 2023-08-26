import { signRequestForPaapiv5 } from "./awsSigv4"
import { AmazonItemsRequestParameters } from "amazon-paapi"
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
        "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
        "Content-Encoding": "amz-1.0"
      },
      body: JSON.stringify(body)
    }
    const unsignedRequest = new Request(
      "https://webservices.amazon.co.jp/paapi5/getitems",
      reqPropaties
    )

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
      const signedRequest = await signRequestForPaapiv5(unsignedRequest, {
        awsRegion: "us-west-2",
        awsService: "ProductAdvertisingAPI",
        awsAccessKeyId: context.env.PAAPI_ACCESSKEY,
        awsSecretAccessKey: context.env.PAAPI_SECRETKEY
      })
      const refreshedRequest = new Request(signedRequest.url, {
        method: signedRequest.method,
        headers: signedRequest.headers,
        body: JSON.stringify(reqPropaties)
      })
      console.log(
        "Request Details: \n",
        refreshedRequest.url,
        refreshedRequest.method,
        JSON.stringify(reqPropaties)
      )
      refreshedRequest.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`)
      })

      const amazonPaapiResponse = await fetch(refreshedRequest)
      const amazonPaapiResponseData = await amazonPaapiResponse.text()
      console.log(
        "Response Details: \n",
        amazonPaapiResponse.ok,
        "\n",
        amazonPaapiResponse.status,
        amazonPaapiResponse.statusText,
        "\n",
        amazonPaapiResponseData
      )
      amazonPaapiResponse.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`)
      })
      return new Response(amazonPaapiResponseData)
    }
  }
}
