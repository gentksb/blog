import { getAmazonProductInfo } from "./src/getAmazonProductInfo"

export interface ENV {
  PAAPI_ACCESSKEY: string
  PAAPI_SECRETKEY: string
  PARTNER_TAG: string
}

export const onRequest: PagesFunction<ENV> = async (context) => {
  console.dir(context, { depth: null, colors: true })
  if (typeof context.params.asin !== "string") {
    return new Response("bad request", {
      status: 400
    })
  } else {
    try {
      const response = await getAmazonProductInfo(context.params.asin, context.env)
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "cache-control": "max-age=86400"
        }
      })
    } catch (error) {
      console.error(error)

      return new Response("internal error", {
        status: 500
      })
    }
  }
}
