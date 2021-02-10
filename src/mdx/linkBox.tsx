import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, Image, Link, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import firebase from "gatsby-plugin-firebase"

interface Props {
  url : string
  isAmazonLink? : boolean
}

interface ApiResponse {
      title: string
      imageUrl: string
      description: string
      siteName: string
      ogpIcon: string
      error?: string
    }

if (process.env.NODE_ENV === 'development' ){
  firebase.functions().useEmulator("localhost", 5001);
}

const LinkBox: React.FunctionComponent<Props> = ( {url, isAmazonLink} ) => {
  const [ogpData, changeOgpData] = useState(Object)
  const urlConstructor = new URL(url)
  const urlDomain = urlConstructor.hostname
  const apiRequestBody = isAmazonLink ? {url: url, isAmazonLink: isAmazonLink} : {url: url}

  useEffect(() => {
    try {
      const getOgpData = firebase.functions().httpsCallable('getOgpLinkData');
      getOgpData(apiRequestBody)
        .then(result => {
          const response: ApiResponse = result.data
          const errorMessage = response.error

          if (errorMessage !== ""){
            console.log(errorMessage)
            return
          }

          const title = response.title || ""
          const imageUrl = response.imageUrl || ""
          const description = response.description || ""
          const siteName = response.siteName || urlDomain
          const siteIconPath = response.ogpIcon || "/favicon.ico"
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


  return (
    <Box p={4} display="flex" borderWidth="1px" borderRadius="xl" mb={[2,2,3,3]}>
      <Box flexShrink={1}>
        <Image
          borderRadius="lg"
          src={ogpData.imageUrl}
          alt={ogpData.title}
          fit="cover"
          fallbackSrc="https://via.placeholder.com/150?text=NoImage"
          paddingRight={[2,2,3,3]}
        />
      </Box>
      <Box flexShrink={1} mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
        <Link
          mt={1}
          display="block"
          fontSize="lg"
          lineHeight="normal"
          fontWeight="semibold"
          href={url}
          isExternal
        >
          <Text noOfLines={[1,1,2,2]} as="span"><ExternalLinkIcon />{ogpData.title}</Text>
        </Link>
        <Text as="span" fontSize="sm" color="gray.500" dangerouslySetInnerHTML={{__html:ogpData.description}} noOfLines={[1,2,2,3]} />
          <Link isExternal href={url}>
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
          <Image src={ogpData.ogpIcon} alt="favicon" maxHeight="2em" fallbackSrc="https://via.placeholder.com/24?text=favicon" />{ogpData.siteName}
          </Text> 
        </Link>
      </Box>
    </Box>
  )
}

export default LinkBox