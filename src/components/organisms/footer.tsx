import React from "react"
import Bio from "../molecules/bio"
import { Box, Image, Text, VStack } from "@chakra-ui/react"
import { Link } from "gatsby"

const Footer: React.FunctionComponent = () => (
  <footer>
    <Box position="static" mt={2} layerStyle="themeBgColor">
      <VStack textAlign="center" justifyContent="center">
        <Bio />
        <Text fontSize="xs">
          © {new Date().getFullYear()}, Built with{` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>{" "}
        </Text>
        <Text fontSize="xs">
          このサイトにおける情報送信については<Link to="/about/" style={{color: "lightgray"}}>外部送信規律に基づく情報提供</Link>をご確認ください
        </Text>
        <Text fontSize="xs">
          このサイトはAmazonアソシエイトの適格販売やGoogle
          Adsenseによる収入で運営されています。
        </Text>
        <a href="https://blogmura.com/profiles/11085449?p_cid=11085449">
          <Image
            htmlWidth="160px"
            htmlHeight="87px"
            src="https://blogparts.blogmura.com/parts_image/user/pv11085449.gif"
            alt="PVアクセスランキング にほんブログ村"
          />
        </a>
      </VStack>
    </Box>
  </footer>
)

export default Footer
