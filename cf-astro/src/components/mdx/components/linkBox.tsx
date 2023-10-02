import { ExternalLinkIcon } from "@chakra-ui/icons"
import {
  Box,
  Image,
  Text,
  LinkBox as ChakraLinkBox,
  LinkOverlay
} from "@chakra-ui/react"
import React from "react"
import type { OgpData } from "../../../../@types/ogpData-type"

interface Props {
  props: OgpData
}

export const ReactLinkBox: React.FunctionComponent<Props> = (ogpData) => {
  const linkColor = "teal.600"
  const { ogpTitle, ogpDescription, ogpImageUrl, ogpSiteName, pageurl, error } =
    ogpData.props

  return (
    <>
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
            src={ogpImageUrl}
            alt={ogpTitle}
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
            href={pageurl}
            isExternal
          >
            <Text noOfLines={[1, 1, 2, 2]} as="span" color={linkColor}>
              <ExternalLinkIcon />
              {ogpTitle}
            </Text>
          </LinkOverlay>
          <Text
            as="span"
            fontSize="sm"
            color="gray.500"
            dangerouslySetInnerHTML={{ __html: ogpDescription ?? "" }}
            noOfLines={[1, 2, 2, 3]}
          />
          <Text
            as="span"
            fontSize="sm"
            letterSpacing="wide"
            color="teal.600"
            fontWeight="Bold"
            mt={3}
            noOfLines={1}
            display="inline-flex"
            alignContent="center"
          >
            {ogpSiteName}
          </Text>
        </Box>
      </ChakraLinkBox>
    </>
  )
}
