import React, { useEffect } from "react"
import { WindowLocation } from "@reach/router"

import { CssBaseline, AppBar, Container } from "@material-ui/core"
import styled from "@emotion/styled"
import {
  ThemeProvider,
  StylesProvider
} from "@material-ui/core/styles"
import Footer from "../components/footer"
import theme from "../config/theme"
import BlogTitleText from "./atoms/blogTitleText"
import { ChakraProvider } from "@chakra-ui/react"

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

  type widthUnion = false | "sm" | "lg" | "xs" | "md" | "xl" | undefined

  let header: React.ReactNode
  let maxMainContentWidth: widthUnion


  const postpathRegExp = RegExp("^/post/.*")

  if (postpathRegExp.test(location.pathname)) {
    header = (
      <BlogTitleText title={title} />
    )
    maxMainContentWidth = "sm"
  } else {
    header = (
      <h1>
        <BlogTitleText title={title} />
      </h1>
    )
    maxMainContentWidth = "lg"
  }

  return (
    <ChakraProvider>
      <CssBaseline>
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <HeaderBar position="static">{header}</HeaderBar>
            <Container
              maxWidth={maxMainContentWidth}
              component="main"
              style={{ margin: `8px auto`, padding: `0px 0px` }}
            >
              {children}
            </Container>
            <Footer />
          </ThemeProvider>
        </StylesProvider>
      </CssBaseline>
    </ChakraProvider>
  )
}

export default Layout
