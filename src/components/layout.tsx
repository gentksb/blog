import React, { useEffect } from "react"
import { Link } from "gatsby"

import { Typography, CssBaseline, AppBar, Container } from "@material-ui/core"
import styled from "@emotion/styled"
import {
  ThemeProvider,
  StylesProvider,
  useTheme,
} from "@material-ui/core/styles"
import Footer from "../components/footer"
import theme from "../config/theme"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iframely: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twitter: any
  }
}

const Layout: React.FunctionComponent = (props) => {
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
    background-image: url("/image/brushed-alum-dark.png");
    height: 10vh;
    max-width: 100%;
    position: relative;
    margin: 0 0 0 0;
    padding: 16px 0px 16px 0px;
  `

  let header
  let maxMainContentWidth

  const postpathRegExp = RegExp("^/post/.*")

  if (postpathRegExp.test(location.pathname)) {
    header = (
      <Typography component="div" variant="h3" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>{title}</BlogTitleLink>
      </Typography>
    )
    maxMainContentWidth = "md"
  } else {
    header = (
      <Typography component="h1" variant="h3" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>{title}</BlogTitleLink>
      </Typography>
    )
    maxMainContentWidth = "lg"
  }
  return (
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
  )
}

export default Layout
