import React from "react"
import useSWR from "swr"
import { LinkCardLayout } from "@layouts/LinkCardLayout"
import type { AmazonItemsResponse } from "amazon-paapi" // LinkCardLayout コンポーネントのパスを適宜調整してください
import { LinkCardSkeltonLayout } from "@layouts/LinkCardSkeletonLayout"

// データフェッチ用の関数
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const AmznClientComponent: React.FC<{ asin: string }> = ({ asin }) => {
  const { data, error, isLoading } = useSWR<AmazonItemsResponse>(
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

  const product = data.ItemsResult.Items[0]

  return (
    <LinkCardLayout
      title={product.ItemInfo.Title?.DisplayValue ?? ""}
      description={product.ItemInfo.Features?.DisplayValues[0] ?? ""}
      imageSrc={
        product.Images?.Primary?.Large?.URL ??
        product.Images?.Primary?.Medium?.URL ??
        ""
      }
      siteName="Amazon.co.jp"
      url={product.DetailPageURL ?? `https://www.amazon.co.jp/dp/${asin}`}
      theme="amazon"
    />
  )
}
