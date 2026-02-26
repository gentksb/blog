import { LinkCardLayout } from "@layouts/LinkCardLayout"
import { LinkCardSkeltonLayout } from "@layouts/LinkCardSkeletonLayout"
import type { CreatorsApiItemsResponse } from "@type/creators-api-type"
import type React from "react"
import useSWR from "swr"

// データフェッチ用の関数
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const AmznClientComponent: React.FC<{ asin: string }> = ({ asin }) => {
  const { data, error, isLoading } = useSWR<CreatorsApiItemsResponse>(
    `/api/getAmznPa/${asin}`,
    fetcher
  )
  const fallBackLayout = (
    <LinkCardLayout
      title="Amazo.co.jp"
      description="Amazon商品ページに移動する"
      url={`https://www.amazon.co.jp/dp/${asin}`}
      siteName="Amazon.co.jp"
      theme="amazon"
    />
  )

  if (isLoading)
    return <LinkCardSkeltonLayout url={`https://www.amazon.co.jp/dp/${asin}`} />
  if (error) {
    console.log(`Amazon PAAPI fetch error asin ${asin}`)
    return fallBackLayout
  }
  if (!data) return fallBackLayout

  const product = data.itemsResult.items[0]

  return (
    <LinkCardLayout
      title={product.itemInfo?.title?.displayValue ?? ""}
      description={product.itemInfo?.features?.displayValues[0] ?? ""}
      imageSrc={
        product.images?.primary?.large?.url ??
        product.images?.primary?.medium?.url ??
        ""
      }
      siteName="Amazon.co.jp"
      url={product.detailPageURL ?? `https://www.amazon.co.jp/dp/${asin}`}
      theme="amazon"
    />
  )
}
