import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, Button, Image, Link, Text, VStack, SimpleGrid, Flex, Spacer } from "@chakra-ui/react"
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
          const siteIconPath = document.querySelector("[type='image/x-icon']")?.getAttribute('href')
          const siteIcon = siteIconPath.includes("//") ? siteIconPath : urlDomain + siteIconPath //絶対パスに変換
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


  return (
    <Box borderRadius="lg" borderWidth="1px" px={3} py={6}>
      <Flex width="100%">
        <Box maxWidth="20%">
          <Link isExternal href={url}>
          <Image src={ogpData.imageUrl} alt={ogpData.title} display="block" />
          </Link>
        </Box>
        <VStack width="auto">
          <Link isExternal href={url}>
            <Box as="h4" lineHeight="tight" fontWeight="SemiBold" mt={1} overflow="hidden">{ogpData.title}</Box>
          </Link>
          <Text fontSize="sm" fontWeight="light" dangerouslySetInnerHTML={{__html:ogpData.description}} />
        </VStack>
      </Flex>
      <Flex width="100%">
        <Box>
          <Link isExternal href={url}>
            <Text fontSize="xs" fontWeight="SemiBold" display="inline-flex"><Image src={ogpData.ogpIcon} alt="favicon" />{ogpData.siteName}</Text>
          </Link>
        </Box>
        <Spacer />
        <Box  align="flex-end">
          <Link isExternal href={url}>
            <Button
              icon={<ExternalLinkIcon />}
              label="Shopで詳細を見る"
              colorScheme="blue"
              mt={2}
              variant='solid'
              float="right">
                詳細を確認する
            </Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  )
}

export default LinkBox