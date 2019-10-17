import React from "react"
import { Link } from "gatsby"

import { Typography, Container, CssBaseline } from '@material-ui/core'
import { ThemeProvider as MaterialThemeProvider, StylesProvider } from "@material-ui/styles";
import styled from "@emotion/styled";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming"
import theme from '../config/theme'

const BlogTitleLink = styled(Link)`
  box-shadow: none;
  text-decoration: none;
  color: white;
`
const HeaderContainer = styled(Container)`
  background-color: ${props => props.theme.palette.primary.main};
  height: 20vh;
  position: relative;
  margin-top: 0;
  padding: 15px 0px 15px 0px;
`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <Typography component="h1" variant="h2" align="center" gutterBottom>
          <BlogTitleLink to={`/`}>
            {title}
          </BlogTitleLink>
        </Typography>
      )
    } else {
      header = (
        <Typography component="h1" variant="h2" align="center" gutterBottom>
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
              <HeaderContainer fixed>
                <header>{header}</header>
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
