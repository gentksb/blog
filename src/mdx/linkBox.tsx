import { Box, Heading, Image, Text } from "@chakra-ui/react"
import React from "react"
import { Url } from "url"

interface Props {
  url : string
}

interface OgpData {
  ogTitle?: string
  ogType?: string
  ogUrl?: Url
  ogDescription?: string
  ogImage?: ogImage
  requestUrl: Url
  success: boolean
}

interface ogImage {
  url: string
  width?: Number
  height?: Number
  type: string
}

const ogs = require('open-graph-scraper-lite')

const LinkBox: React.FunctionComponent<Props> = ( {url} ) => {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/"
  const headers = { 'x-requested-with': '' }

  const ogs_options = {url: proxyUrl + url, headers:headers}
  const ogpData: OgpData = ogs(ogs_options).then((data)=>{
    const { error, result, response } = data
    console.log(response)
    return result || error
  })
  const cardTitle = ogpData.ogTitle
  const cardDescripttion = ogpData.ogDescription
  const ogImageData = ogpData.ogImage

  return (
    <Box>
      <Image src={ogImageData.url} alt={cardTitle} />
      <Box>
        <Heading>{cardTitle}</Heading>
        <Text>{cardDescripttion}</Text>
      </Box>
    </Box>
  )
}

export default LinkBox