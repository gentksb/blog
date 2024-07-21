import { AmazonItemsResponse } from "amazon-paapi"
import { getAmazonProductInfo } from "../src/getAmazonProductInfo"

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const asin = context.params.asin
  const isValidAsin = (asin: string): boolean => {
    return /^[A-Z0-9]{10}$/.test(asin)
  }
  if (!asin || !isValidAsin || typeof asin !== "string") {
    throw new Error("asin is't valid.")
  }
  const { PAAPI_ACCESSKEY, PAAPI_SECRETKEY, PARTNER_TAG } = context.env
  console.log(`Requested asin is ${asin}.`)

  const kvCache: AmazonItemsResponse = await context.env.PAAPI_DATASTORE.get(
    asin,
    "json"
  )

  const productData = kvCache
    ? kvCache
    : await getAmazonProductInfo(
        asin,
        PAAPI_ACCESSKEY,
        PAAPI_SECRETKEY,
        PARTNER_TAG
      )

  if (!kvCache) {
    await context.env.OGP_DATASTORE.put(asin, JSON.stringify(productData), {
      expirationTtl: 60 * 60 * 24
    }).then(() => console.log(`write PAAPI Cache. asin: ${asin}`))
  } else {
    console.log(`hitted PAAPI KV cache`)
  }

  const response = new Response(JSON.stringify(productData))

  return response
}
