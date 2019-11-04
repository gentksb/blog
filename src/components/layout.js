import React from "react"
import { Link } from "gatsby"

import { Typography, Container, CssBaseline } from '@material-ui/core'
import styled from "@emotion/styled";
import { ThemeProvider as MaterialThemeProvider, StylesProvider } from "@material-ui/styles";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming"
import theme from '../config/theme'

const BlogTitleLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.palette.text.secondary};
`
const HeaderContainer = styled(Container)`
  background-color: ${props => props.theme.palette.primary.main};
  height: 10vh;
  max-width: 100%;
  position: relative;
  margin: 0 0 0 0;
  padding: 15px 0px 15px 0px;
`
const BlogTitle = styled(Typography)`

`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <BlogTitle component="h1" variant="h3" align="center" gutterBottom>
          <BlogTitleLink to={`/`}>
            {title}
          </BlogTitleLink>
        </BlogTitle>
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
          <MaterialThemeProvider theme={theme}>
            <EmotionThemeProvider theme={theme}>
              <HeaderContainer component="header" fixed>
                {header}
              </HeaderContainer>
              <main>{children}</main>
              <footer>
                © {new Date().getFullYear()}, Built with
          {` `}
                <a href="https://www.gatsbyjs.org">Gatsby</a>
              </footer>
            </EmotionThemeProvider>
          </MaterialThemeProvider>
        </StylesProvider>
      </CssBaseline>
    )
  }
}

export default Layout
