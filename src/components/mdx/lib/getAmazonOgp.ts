import type { OgpData } from "@type/ogpData-type"
import type { AmazonItemsResponse } from "amazon-paapi"
import { getAmazonProductInfo } from "./getAmazonProductInfo"

export const getAmazonOgp = async (asin: string) => {
  const ogpData: OgpData = {
    ok: false
  }

  //  response cache get-through logic here, using Cloudflare KV with typescript
  // https://developers.cloudflare.com/workers/runtime-apis/kv
  const getAmazonProductInfoCacheThrough = async (asin: string, env: Env) => {
    const cache: AmazonItemsResponse = await env.PAAPI_DATASTORE.get(
      asin,
      "json"
    )
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

  const productData = await getAmazonProductInfoCacheThrough(asin)

  if (productData.Errors) {
    ogpData.ok = false
    ogpData.error = productData.Errors[0].Message
    console.log("catch api error response")
    return ogpData
  } else {
    ogpData.ok = true
    ogpData.ogpTitle =
      productData.ItemsResult.Items[0].ItemInfo.Title?.DisplayValue ?? ""
    ogpData.ogpDescription =
      productData.ItemsResult.Items[0].ItemInfo.Features?.DisplayValues[0] ?? ""
    ogpData.ogpImageUrl =
      productData.ItemsResult.Items[0].Images?.Primary?.Large?.URL ??
      productData.ItemsResult.Items[0].Images?.Primary?.Medium?.URL ??
      ""
    ogpData.pageurl =
      productData.ItemsResult.Items[0].DetailPageURL ??
      `https://www.amazon.co.jp/dp/${asin}`
    return ogpData
  }
}
