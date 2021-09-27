import { ExternalLinkIcon } from "@chakra-ui/icons"
import {
  Box,
  CircularProgress,
  Image,
  Text,
  LinkBox as ChakraLinkBox,
  LinkOverlay
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { getApp } from "firebase/app"
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator
} from "firebase/functions"

interface Props {
  url: string
  isAmazonLink?: boolean
}

interface ApiResponse {
  title: string
  imageUrl: string
  description: string
  siteName: string
  ogpIcon: string
  pageurl: string
  error?: string
}

const functions = getFunctions(getApp(), "asia-northeast1")
if (process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functions, "localhost", 5001)
}

const LinkBox: React.FunctionComponent<Props> = ({ url, isAmazonLink }) => {
  const [ogpData, changeOgpData] = useState(Object)
  const [loading, changeLoading] = useState(true)
  const encodedUrl = encodeURI(url)
  const urlConstructor = new URL(encodedUrl)
  const urlDomain = urlConstructor.hostname
  const apiRequestBody = isAmazonLink
    ? { url: encodedUrl, isAmazonLink: isAmazonLink }
    : { url: encodedUrl }

  useEffect(() => {
    try {
      const getOgpData = httpsCallable(functions, "getOgpLinkData")
      getOgpData(apiRequestBody).then((result) => {
        const response = result.data as ApiResponse

        const title = response.title
        const imageUrl = response.imageUrl
        const description = response.description
        const siteName = response.siteName ?? urlDomain
        const siteIconPath = response.ogpIcon ?? "/favicon.ico"
        const siteIcon = siteIconPath.includes("//")
          ? siteIconPath
          : `https://${urlDomain}${siteIconPath}` //絶対パスに変換
        const linkurl = response.pageurl ?? encodedUrl
        console.log(title, linkurl, imageUrl, description, siteName, siteIcon)
        const isImageUrlExists = imageUrl !== ""

        changeOgpData({
          title: title,
          imageUrl: isImageUrlExists ? imageUrl : null,
          description: description,
          siteName: siteName,
          ogpIcon: siteIcon,
          url: linkurl
        })
        changeLoading(false)
      })
    } catch (error) {
      console.error(error.code, error.message, error.details)
    }
  }, [])

  return (
    <ChakraLinkBox
      p={4}
      display="flex"
      borderWidth="1px"
      borderRadius="xl"
      mb={[2, 2, 3, 3]}
    >
      <Box flexShrink={1} maxWidth={["100px", "100px", "150px", "150px"]}>
        <Image
          borderRadius="lg"
          src={ogpData.imageUrl}
          alt={ogpData.title}
          fit="cover"
          paddingRight={[2, 2, 3, 3]}
          width="100%"
          loading="lazy"
        />
      </Box>
      <Box flexShrink={1} mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
        <LinkOverlay
          mt={1}
          display="block"
          fontSize="lg"
          lineHeight="normal"
          fontWeight="semibold"
          href={ogpData.url}
          isExternal
        >
          <Text noOfLines={[1, 1, 2, 2]} as="span">
            <ExternalLinkIcon />
            {ogpData.title}
          </Text>
        </LinkOverlay>
        <Text
          as="span"
          fontSize="sm"
          color="gray.500"
          dangerouslySetInnerHTML={{ __html: ogpData.description }}
          noOfLines={[1, 2, 2, 3]}
        />
        <Text
          as="span"
          fontSize="sm"
          letterSpacing="wide"
          color="teal.600"
          display="inline-flex"
          fontWeight="Bold"
          mt={3}
          isTruncated
        >
          {loading ? (
            <CircularProgress isIndeterminate color="teal.300" />
          ) : (
            <Image
              src={ogpData.ogpIcon}
              alt="favicon"
              maxHeight="2em"
              fallbackSrc="https://via.placeholder.com/24?text=f"
            />
          )}
          {ogpData.siteName}
        </Text>
      </Box>
    </ChakraLinkBox>
  )
}

export default LinkBox
