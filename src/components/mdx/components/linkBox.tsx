import React, { useEffect, useState } from "react"
import type { OgpData } from "../../../../@types/ogpData-type"
import { getAmazonOgp } from "../lib/getAmazonOgp"
import { getAsinFromUrl } from "../lib/getAsinFromUrl"
import { LinkBoxLayout } from "./linkBoxLayout"

interface Props {
  url: string
  isAmazonLink?: boolean
  isA8Link?: boolean
  linkurl?: string
}

export const ReactLinkBox: React.FunctionComponent<Props> = ({
  url,
  isAmazonLink,
  isA8Link,
  linkurl
}) => {
  const [ogpData, changeOgpData] = useState<OgpData>({ ok: false })
  const [loading, changeLoading] = useState(true)
  const linkBoxHandler = async ({
    url,
    isAmazonLink,
    isA8Link,
    linkurl
  }: Props) => {
    try {
      const asin = getAsinFromUrl(url)
      const amazonData: OgpData = await getAmazonOgp(asin)
      changeOgpData(amazonData)
      changeLoading(false)
    } catch (error) {
      console.log("catch exception error when calling api")
      const temporaryLinkText = isAmazonLink ? "amazon.co.jp" : "外部サイトへ"
      changeOgpData({
        ogpTitle: temporaryLinkText,
        pageurl: linkurl ?? url,
        ok: false
      })
      changeLoading(false)
    }
  }

  useEffect(() => {
    linkBoxHandler({ url, isAmazonLink, isA8Link, linkurl })
  }, [url, isAmazonLink, isA8Link, linkurl, loading])

  return <LinkBoxLayout {...ogpData} loading={loading} />
}
