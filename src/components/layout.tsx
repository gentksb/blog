import React, { useEffect } from "react"
import { Link } from "gatsby"
import { WindowLocation } from "@reach/router"

import { Typography, CssBaseline, AppBar, Container } from "@material-ui/core"
import styled from "@emotion/styled"
import {
  ThemeProvider,
  StylesProvider,
  useTheme,
} from "@material-ui/core/styles"
import Footer from "../components/footer"
import theme from "../config/theme"
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
  const blogtheme = useTheme()
  useEffect(() => {
    if (window.iframely) {
      window.iframely.load()
    }
    // ツイート内容を埋め込みたい場合
    if (window.twitter) {
      window.twitter.widgets.load()
    }
  })

  const BlogTitleLink = styled(Link)`
    color: ${blogtheme.palette.common.white};
    text-decoration: none;
  `
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
      <Typography component="div" variant="h4" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>{title}</BlogTitleLink>
      </Typography>
    )
    maxMainContentWidth = "sm"
  } else {
    header = (
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>{title}</BlogTitleLink>
      </Typography>
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
