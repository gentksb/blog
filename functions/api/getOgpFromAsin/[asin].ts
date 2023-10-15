import { AmazonItemsResponse } from "amazon-paapi"
import { getAmazonProductInfo } from "./src/getAmazonProductInfo"

export interface ENV {
  PAAPI_ACCESSKEY: string
  PAAPI_SECRETKEY: string
  PARTNER_TAG: string
  PAAPI_DATASTORE: KVNamespace
}

//  response cache get-through logic here, using Cloudflare KV with typescript
// https://developers.cloudflare.com/workers/runtime-apis/kv
const getAmazonProductInfoCacheThrough = async (asin: string, env: ENV) => {
  const cache: AmazonItemsResponse = await env.PAAPI_DATASTORE.get(asin, "json")
  if (cache) {
    console.log("cache hit")
    console.dir(cache, { depth: null, colors: true })
    return cache
  } else {
    const response = await getAmazonProductInfo(asin, env)
    await env.PAAPI_DATASTORE.put(asin, JSON.stringify(response), {
      expirationTtl: 86400
    })
    return response
  }
}

export const onRequest: PagesFunction<ENV> = async (context) => {
  console.dir(context, { depth: null, colors: true })
  if (typeof context.params.asin !== "string") {
    return new Response("bad request", {
      status: 400
    })
  } else {
    try {
      const response = await getAmazonProductInfoCacheThrough(
        context.params.asin,
        context.env
      )
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
