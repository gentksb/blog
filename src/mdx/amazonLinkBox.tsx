import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, Image, Link, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

interface Props {
  url : string
}

const proxyUrl = "https://cors-anywhere.herokuapp.com/"
const headers = { 'x-requested-with': '' }

const LinkBox: React.FunctionComponent<Props> = ( {url} ) => {
  const [ogpData, changeOgpData] = useState(Object)
  const urlConstructor = new URL(url)
  const urlDomain = urlConstructor.hostname

  useEffect(() => {
    try {
      fetch( proxyUrl + url, {headers: headers})
        .then(res => res.text())
        .then(data => {
          // console.log(data)
          const document = new DOMParser().parseFromString(data, "text/html")
          const title = document.querySelector("meta[property='og:title']")?.getAttribute('content') || document.querySelector("meta[name='title']")?.getAttribute('content') || document.querySelector('title')?.innerText || ""
          const imageUrl = document.querySelector("meta[property='og:image']")?.getAttribute('content') || ""
          const description = document.querySelector("meta[property='og:description']")?.getAttribute('content') || document.querySelector("meta[name='description']")?.getAttribute('content') || ""
          const siteName = document.querySelector("meta[property='og:site_name']")?.getAttribute('content') || urlDomain
          const siteIconPath = document.querySelector("[type='image/x-icon']")?.getAttribute('href') || ""
          const siteIcon = siteIconPath.includes("//") ? siteIconPath : `https://${urlDomain}${siteIconPath}` //絶対パスに変換
          console.log(title, imageUrl, description, siteName, siteIcon)
          changeOgpData(
            {
              title: title,
              imageUrl: imageUrl,
              description: description,
              siteName: siteName,
              ogpIcon: siteIcon
            }
          )
        })
    } catch (error) {
      console.error(error)
    }
  },[])
//データの取得ルールだけ変更して他はそのままにする

  return (
    <Box p={4} display={{ md: "flex" }} borderWidth="1px" borderRadius="xl">
      <Box flexShrink={0}>
        <Image
          borderRadius="lg"
          width={{ md: 40 }}
          src={ogpData.imageUrl}
          alt={ogpData.title}
          maxHeight="20vh"
        />
      </Box>
      <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="wide"
          color="teal.600"
        >
          <Link isExternal href={url}>
                <Text fontSize="xs" fontWeight="SemiBold" display="inline-flex"><Image src={ogpData.ogpIcon} alt="favicon" />{ogpData.siteName}</Text>
              </Link>
        </Text>
        <Link
          mt={1}
          display="block"
          fontSize="lg"
          lineHeight="normal"
          fontWeight="semibold"
          href={url}
        >
          {ogpData.title}<ExternalLinkIcon />
        </Link>
        <Text mt={2} color="gray.500" dangerouslySetInnerHTML={{__html:ogpData.description}} />
      </Box>
    </Box>
  )
}

export default LinkBox