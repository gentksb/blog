import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Box, Image, Link, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import firebase from "gatsby-plugin-firebase"

interface Props {
  url : string
}

if (process.env.NODE_ENV === 'development' ){
  firebase.functions().useEmulator("localhost", 5001);
}

const LinkBox: React.FunctionComponent<Props> = ( {url} ) => {
  const [ogpData, changeOgpData] = useState(Object)
  const urlConstructor = new URL(url)
  const urlDomain = urlConstructor.hostname

  useEffect(() => {
    try {
      const getOgpData = firebase.functions().httpsCallable('getOgpLinkData');
      getOgpData({url: url})
        .then(result => {
          const title = result.data.title || ""
          const imageUrl = result.data.imageUrl || ""
          const description = result.data.description || ""
          const siteName = result.data.siteName || urlDomain
          const siteIconPath = result.data.ogpIcon || "/favicon.ico"
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