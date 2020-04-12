import React from "react"
import { Link } from "gatsby"

import { Typography, CssBaseline, AppBar } from '@material-ui/core'
import styled from "@emotion/styled";
import { ThemeProvider, StylesProvider, useTheme } from "@material-ui/core/styles";
import theme from '../config/theme'

const Layout = (props) => {
  const { location, title, children } = props
  const rootPath = `${__PATH_PREFIX__}/`
  const blogtheme = useTheme();

  const BlogTitleLink = styled(Link)`
  color: ${blogtheme.palette.common.white};
  text-decoration: none;
`
  const HeaderBar = styled(AppBar)`
  background-color: #e60c00;
  background-image: url("/image/diagmonds-light.png");
  /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
  height: 10vh;
  max-width: 100%;
  position: relative;
  margin: 0 0 0 0;
  padding: 16px 0px 16px 0px;
`

  let header
  if (location.pathname === rootPath) {
    header = (
      <Typography component="h1" variant="h3" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>
          {title}
        </BlogTitleLink>
      </Typography>
    )
  } else {
    header = (
      <Typography component="div" variant="h3" align="center" gutterBottom>
        <BlogTitleLink to={`/`}>
          {title}
        </BlogTitleLink>
      </Typography>
    )
  }
  return (
    <CssBaseline>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <HeaderBar position="static">
            {header}
          </HeaderBar>
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()}, Built with
          {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
            <p>This website uses Cookie to ensure you get the best experience on this website.</p>
          </footer>
        </ThemeProvider>
      </StylesProvider>
    </CssBaseline>
  )
}


export default Layout
