import React from "react"
import { Link } from "gatsby"

import { Typography, CssBaseline, AppBar, Container } from '@material-ui/core'
import styled from "@emotion/styled";
import { ThemeProvider, StylesProvider, useTheme } from "@material-ui/core/styles";
import Footer from "../components/footer"
import theme from '../config/theme'

const Layout = (props) => {
  const { location, title, children } = props
  const blogtheme = useTheme();

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

  const postpathRegExp = RegExp('^/post/.*')

  if (postpathRegExp.test(location.pathname)) {
    header = (
      <Typography component="div" variant="h3" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>
          {title}
        </BlogTitleLink>
      </Typography>
    )
    maxMainContentWidth = "md"
  } else {
    header = (
      <Typography component="h1" variant="h3" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>
          {title}
        </BlogTitleLink>
      </Typography>
    )
    maxMainContentWidth = "lg"
  }
  return (
    <CssBaseline>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <HeaderBar position="static">
            {header}
          </HeaderBar>
          <Container maxWidth={maxMainContentWidth} component="main" style={{ margin: `8px auto` }}>
            {children}
          </Container>
          <Footer />
        </ThemeProvider>
      </StylesProvider>
    </CssBaseline>
  )
}


export default Layout
