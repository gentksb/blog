import type { OgpData } from "@type/ogpData-type"
import type { AmazonItemsResponse } from "amazon-paapi"

export const getAmazonOgp = async (asin: string) => {
  const ogpData: OgpData = {
    ok: false
  }
  console.log(`fetch ${window.location.origin}/api/getOgpFromAsin/${asin}`)
  const productData = await fetch(
    // browser side URL detection
    new URL(`/api/getOgpFromAsin/${asin}`, window.location.origin)
  )
  const productDataJson: AmazonItemsResponse = await productData.json()
  if (productDataJson.Errors) {
    ogpData.ok = false
    ogpData.error = productDataJson.Errors[0].Message
    console.log("catch api error response")
    return ogpData
  } else {
    ogpData.ok = true
    ogpData.ogpTitle =
      productDataJson.ItemsResult.Items[0].ItemInfo.Title?.DisplayValue ?? ""
    ogpData.ogpDescription =
      productDataJson.ItemsResult.Items[0].ItemInfo.Features
        ?.DisplayValues[0] ?? ""
    ogpData.ogpImageUrl =
      productDataJson.ItemsResult.Items[0].Images?.Primary?.Large?.URL ??
      productDataJson.ItemsResult.Items[0].Images?.Primary?.Medium?.URL ??
      ""
    ogpData.pageurl =
      productDataJson.ItemsResult.Items[0].DetailPageURL ??
      `https://www.amazon.co.jp/dp/${asin}`
    return ogpData
  }
}
