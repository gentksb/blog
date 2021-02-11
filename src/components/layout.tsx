import React, { useEffect } from "react"
import { WindowLocation } from "@reach/router"
import { Box, ChakraProvider, Container } from "@chakra-ui/react"

import theme from "./utils/theme"
import Footer from "./organisms/footer"
import BlogTitleText from "./atoms/blogTitleText"


declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twitter: any
  }
}

interface LocationState {
  title: string
  location: WindowLocation
}

interface Props extends LocationState {}

const Layout: React.FunctionComponent<Props> = (props) => {
  const { location, title, children } = props
  useEffect(() => {
    // ツイート内容を埋め込みたい場合
    if (window.twitter) {
      window.twitter.widgets.load()
    }
  })

  const postpathRegExp = RegExp("^/post/.*")
  const headerMarkup = postpathRegExp.test(location.pathname)
    ? "span" : "h1"

  return (
    <ChakraProvider theme={theme}>
      <Box position="static" layerStyle="themeBgColor" maxW="100%" m="0 0 0 0" padding="0.5rem 0 0.5rem 0" textAlign="center">
        <BlogTitleText title={title} markup={headerMarkup} />
      </Box>
        <Container maxW="3xl" centerContent>
          {children}
        </Container>
      <Footer />
    </ChakraProvider>
  )
}

export default Layout
