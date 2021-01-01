import React from "react"
import Bio from "../molecules/bio"
import { Box, Image, Text, VStack } from "@chakra-ui/react"

const Footer: React.FunctionComponent = () => (
  <footer>
    <Box position="static" marginTop="0.5rem" layerStyle="themeBgColor">
      <VStack textAlign="center" justifyContent="center">
        <Bio />
        <Text fontSize="xs">
          © {new Date().getFullYear()}, Built with{` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
            <p>This website uses Cookie to ensure you get the best experience on this
            website.</p>
        </Text>
        <a href="https://blogmura.com/profiles/11085449?p_cid=11085449">
          <Image src="https://blogparts.blogmura.com/parts_image/user/pv11085449.gif" alt="PVアクセスランキング にほんブログ村" />
        </a>
      </VStack>
    </Box>
  </footer>
)

export default Footer
