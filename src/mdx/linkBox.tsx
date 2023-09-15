import { ExternalLinkIcon } from "@chakra-ui/icons"
import {
  Box,
  CircularProgress,
  Image,
  Text,
  LinkBox as ChakraLinkBox,
  LinkOverlay,
  Spacer
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
  isA8Link?: boolean
  linkurl?: string
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

const LinkBox: React.FunctionComponent<Props> = ({
  url,
  isAmazonLink,
  isA8Link,
  linkurl
}) => {
  const [ogpData, changeOgpData] = useState(Object)
  const [loading, changeLoading] = useState(true)
  const encodedUrl = encodeURI(url)
  const urlConstructor = new URL(encodedUrl)
  const urlDomain = urlConstructor.hostname

  useEffect(() => {
    const apiRequestBody = {
      url: encodedUrl,
      isAmazonLink: isAmazonLink ?? false,
      isA8Link: isA8Link ?? false
    }

    try {
      const functions = getFunctions(getApp(), "asia-northeast1")
      if (process.env.NODE_ENV === "development") {
        connectFunctionsEmulator(functions, "localhost", 5001)
      }

      const getOgpData = httpsCallable(functions, "getOgpLinkData")
      getOgpData(apiRequestBody)
        .then((result) => {
          const response = result.data as ApiResponse

          const title = response.title
          const imageUrl = response.imageUrl
          const description = response.description
          const siteName = response.siteName ?? urlDomain
          const ogpIcon = response.ogpIcon
          const linkurl = response.pageurl ?? url
          console.log(title, linkurl, imageUrl, description, siteName, ogpIcon)
          const isImageUrlExists = imageUrl !== ""

          changeOgpData({
            title: title,
            imageUrl: isImageUrlExists ? imageUrl : null,
            description: description,
            siteName: siteName,
            ogpIcon: ogpIcon,
            url: linkurl
          })
          changeLoading(false)
        })
        .catch((error) => {
          console.log("catch api error response")
          console.error(
            `code: ${error.code}, message: ${error.message}, detail:${error.detail}`
          )
          const temporaryLinkText = isAmazonLink
            ? "amazon.co.jp"
            : "外部サイトへ"
          changeOgpData({
            title: temporaryLinkText,
            url: url
          })
          changeLoading(false)
        })
    } catch (error) {
      console.error(error.code, error.message, error.details)
      console.log("catch exception error when calling api")
      const temporaryLinkText = isAmazonLink ? "amazon.co.jp" : "外部サイトへ"
      changeOgpData({
        title: temporaryLinkText,
        url: url
      })
      changeLoading(false)
    }
  }, [isAmazonLink, encodedUrl, urlDomain, isA8Link])

  const linkColor = "teal.600"

  return (
    <>
      <ChakraLinkBox
        p={2}
        display="flex"
        borderWidth="1px"
        borderRadius="none"
        mb={[2, 2, 3, 3]}
      >
        <Box flexShrink={1} ml={{ base: 0, md: 2 }}>
          <LinkOverlay
            display="block"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="normal"
            fontWeight="semibold"
            href={linkurl ?? ogpData.url}
            isExternal
          >
            <Text noOfLines={[2, 2, 3, 3]} as="span" color={linkColor}>
              <ExternalLinkIcon />
              {ogpData.title}
            </Text>
          </LinkOverlay>
          <Text
            as="span"
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.500"
            dangerouslySetInnerHTML={{ __html: ogpData.description }}
            noOfLines={2}
          />
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
              <Image
                src={ogpData.ogpIcon}
                alt="favicon"
                maxHeight="2em"
                display="inline-flex"
                fallbackSrc="https://via.placeholder.com/24/FFFFFF/FFFFFF/"
                objectFit="contain"
              />
            )}
            {ogpData.siteName}
          </Text>
        </Box>
        <Spacer />
        <Box flexShrink={1} maxWidth={["100px", "100px", "150px", "150px"]}>
          <Image
            borderRadius="none"
            src={ogpData.imageUrl}
            alt={ogpData.title}
            fit="cover"
            paddingRight={[2, 2, 3, 3]}
            width="100%"
            loading="lazy"
          />
        </Box>
      </ChakraLinkBox>
    </>
  )
}

export default LinkBox
