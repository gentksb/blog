import React from "react"
import useSWR from "swr"
import { LinkCardLayout } from "@layouts/LinkCardLayout"
import { LinkCardSkeltonLayout } from "@layouts/LinkCardSkeletonLayout"
import type { OgpData } from "@type/ogpData-type"

// データフェッチ用の関数
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const LinkCardClientComponent: React.FC<{
  url: string
  linkUrl?: string
}> = ({ url, linkUrl }) => {
  const { data, error, isLoading } = useSWR<OgpData>(
    `/api/getOgp?url=${url}`,
    fetcher
  )
  const brandColorTheme = url.includes("yahoo.co.jp")
    ? "yahoo"
    : url.includes("rakuten.co.jp")
      ? "rakuten"
      : undefined

  const fallBackLayout = (
    <LinkCardLayout
      title={url}
      description=""
      url={linkUrl ?? url}
      siteName=""
      theme={brandColorTheme}
    />
  )

  if (isLoading) return <LinkCardSkeltonLayout url={linkUrl ?? url} />
  if (error) {
    console.log(`OGP data fetch error url=${url}`)
    return fallBackLayout
  }
  if (!data) return fallBackLayout

  return (
    <LinkCardLayout
      title={data.ogpTitle ?? ""}
      description={data.ogpDescription ?? ""}
      imageSrc={data.ogpImageUrl ?? ""}
      siteName={data.ogpSiteName ?? ""}
      url={linkUrl ?? url}
      theme={brandColorTheme}
    />
  )
}
