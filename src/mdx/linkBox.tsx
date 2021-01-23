import { Box, Heading, Image, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

interface Props {
  url : string
}

  const proxyUrl = "https://cors-anywhere.herokuapp.com/"
  const headers = { 'x-requested-with': '' }

const LinkBox: React.FunctionComponent<Props> = ( {url} ) => {
  const [ogpData, changeOgpData] = useState(Object)
  useEffect(() => {
    try {
      fetch( proxyUrl + url, {headers: headers})
        .then(res => res.text())
        .then(data => {
          console.log(data)
          const document = new DOMParser().parseFromString(data, "text/html")
          const title = document.querySelector("meta[property='og:title']").getAttribute('content') || document.querySelector("meta[name='title']").getAttribute('content') || document.querySelector('title').children.toString() || ""
          const imageUrl = document.querySelector("meta[property='og:image']").getAttribute('content') || ""
          const description = document.querySelector("meta[property='og:description']").getAttribute('content') || document.querySelector("meta[property='description']").getAttribute('content') || ""
          changeOgpData(
            {
              title: title,
              imageUrl: imageUrl,
              description: description
            }
          )
        })
    } catch (error) {
      console.error(error)
    }
  },[])


  return (
      <Box>
        <Image src={ogpData.imageUrl} alt={ogpData.title} />
        <Box>
          <Heading>{ogpData.title}</Heading>
          <Text>{ogpData.description}</Text>
        </Box>
      </Box>
  )
}

export default LinkBox