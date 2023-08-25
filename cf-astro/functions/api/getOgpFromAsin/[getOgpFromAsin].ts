import amazonPaapi from "amazon-paapi"
// Error: Browser-only version of superagent could not find XHR
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

    const callPaapi = async (asin) => {
      const amazonPaApiKey = context.env.PAAPI_ACCESSKEY
      const amazonPaApiSecret = context.env.PAAPI_SECRETKEY
      const amazonPaApiPartnerTag = context.env.PARTNER_TAG
      if (
        typeof amazonPaApiKey !== "string" ||
        typeof amazonPaApiSecret !== "string" ||
        typeof amazonPaApiPartnerTag !== "string"
      ) {
        console.log(
          "env error",
          "types:",
          typeof amazonPaApiKey,
          typeof amazonPaApiSecret,
          typeof amazonPaApiPartnerTag
        )
        return new Response("Environment variables are not valid", {
          status: 500
        })
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
              return new Response("PAAPI call error", { status: 500 })
            }
          }
        }
        return new Response("internal", {
          status: 500,
          statusText: "Backoff loop had done, but nothing happened"
        })
      }
    }
    const response = await callPaapi(asin)
    return new Response(JSON.stringify(response))
  }
}
