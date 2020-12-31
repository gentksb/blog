import React, { useEffect } from "react"
import { WindowLocation } from "@reach/router"
import { AppBar } from "@material-ui/core"
import styled from "@emotion/styled"
import { ChakraProvider, Container } from "@chakra-ui/react"

import Footer from "./organisms/footer"
import BlogTitleText from "./atoms/blogTitleText"


declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iframely: any
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
    if (window.iframely) {
      window.iframely.load()
    }
    // ツイート内容を埋め込みたい場合
    if (window.twitter) {
      window.twitter.widgets.load()
    }
  })

  const HeaderBar = styled(AppBar)`
    background-color: "#2B0E00";
    max-width: 100%;
    position: relative;
    margin: 0 0 0 0;
    padding: 16px 0px 8px 0px;
  `

  const postpathRegExp = RegExp("^/post/.*")
  const headerMarkup = postpathRegExp.test(location.pathname)
    ? "span" : "h1"

  return (
    <ChakraProvider>
      <HeaderBar position="static">
        <BlogTitleText title={title} markup={headerMarkup} />
      </HeaderBar>
        <Container maxW="3xl" centerContent>
          {children}
        </Container>
      <Footer />
    </ChakraProvider>
  )
}

export default Layout
