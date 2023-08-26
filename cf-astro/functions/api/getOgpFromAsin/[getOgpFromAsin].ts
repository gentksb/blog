import { signRequestForPaapiv5 } from "./awsSigv4"
interface ENV {
  PAAPI_ACCESSKEY: string
  PAAPI_SECRETKEY: string
  PARTNER_TAG: string
}

export const onRequest: PagesFunction<ENV> = async (context) => {
  if (typeof context.params.getOgpFromAsin !== "string") {
    return new Response("Parameter is not a single string", { status: 400 })
  } else {
    const asin = context.params.getOgpFromAsin
    const body = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ItemIds: [asin],
        Marketplace: "www.amazon.co.jp",
        PartnerType: "Associates",
        ItemIdType: "ASIN",
        Condition: "New",
        Resources: [
          "Images.Primary.Medium",
          "Images.Primary.Large",
          "ItemInfo.Title",
          "ItemInfo.Features"
        ]
      })
    }
    const unsignedRequest = new Request(
      "https://webservices.amazon.co.jp/paapi5/getitems",
      body
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
        awsRegion: "us-east-1",
        awsService: "ProductAdvertisingAPI",
        awsAccessKeyId: context.env.PAAPI_ACCESSKEY,
        awsSecretAccessKey: context.env.PAAPI_SECRETKEY
      })
      const refreshedRequest = new Request(signedRequest.url, {
        method: signedRequest.method,
        headers: signedRequest.headers,
        body: JSON.stringify(body)
      })

      const amazonPaapiResponse = await fetch(refreshedRequest)
      const amazonPaapiResponseData = await amazonPaapiResponse.json()
      return new Response(JSON.stringify(amazonPaapiResponseData))
    }
  }
}
