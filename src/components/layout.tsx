import React from "react"
import { WindowLocation } from "@reach/router"
import { Box, ChakraProvider, Container } from "@chakra-ui/react"

import theme from "./utils/theme"
import Footer from "./organisms/footer"
import BlogTitleText from "./atoms/blogTitleText"

interface LocationState {
  title: string
  location: WindowLocation
}

const Layout: React.FunctionComponent<LocationState> = (props) => {
  const { location, title, children } = props

  const postpathRegExp = RegExp("^/post/.*")
  const headerMarkup = postpathRegExp.test(location.pathname) ? "span" : "h1"

  return (
    <ChakraProvider theme={theme}>
      <Box
        position="static"
        layerStyle="themeBgColor"
        maxW="100%"
        m="0 0 0 0"
        padding="0.5rem 0 0.5rem 0"
        textAlign="center"
      >
        <BlogTitleText title={title} markup={headerMarkup} />
      </Box>
      <Container maxW="3xl" padding="0 0 0 0" centerContent>
        {children}
      </Container>
      <Footer />
    </ChakraProvider>
  )
}

export default Layout
