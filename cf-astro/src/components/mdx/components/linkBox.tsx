import { ExternalLinkIcon } from "@chakra-ui/icons"
import {
  Box,
  Image,
  Text,
  LinkBox as ChakraLinkBox,
  LinkOverlay,
  CircularProgress,
  Spacer
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import type { OgpData } from "../../../../@types/ogpData-type"
import { getAmazonOgp } from "../lib/getAmazonOgp"
import { getAsinFromUrl } from "../lib/getAsinFromUrl"

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
  const linkColor = "teal.600"
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
  }, [url, isAmazonLink, isA8Link, linkurl])

  return (
    <ChakraLinkBox
      display="flex"
      borderWidth="1px"
      borderRadius="none"
      mb={[2, 2, 3, 3]}
    >
      <Box flexShrink={1} mt={2} ml={2}>
        <LinkOverlay
          display="block"
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="normal"
          fontWeight="semibold"
          href={linkurl ?? ogpData.pageurl}
          isExternal
        >
          <Text noOfLines={[2, 2, 3, 3]} as="span" color={linkColor}>
            <ExternalLinkIcon />
            {ogpData.ogpTitle}
          </Text>
        </LinkOverlay>
        <Text
          as="span"
          fontSize={{ base: "2xs", md: "xs" }}
          letterSpacing="wide"
          color="teal.600"
          fontWeight="Bold"
          mt={3}
          noOfLines={1}
          display="inline-flex"
          alignContent="center"
        >
          {loading ? (
            <CircularProgress isIndeterminate color={linkColor} />
          ) : (
            ""
          )}
          {ogpData.ogpSiteName}
        </Text>
      </Box>
      <Spacer />
      <Box flexShrink={1} maxWidth={["100px", "100px", "150px", "150px"]}>
        <Image
          borderRadius="none"
          src={ogpData.ogpImageUrl}
          alt={ogpData.ogpTitle}
          fit="cover"
          width="100%"
          height="100%"
          loading="lazy"
          margin={0}
        />
      </Box>
    </ChakraLinkBox>
  )
}
