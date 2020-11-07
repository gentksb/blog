import React from "react"
import { AppBar, Typography } from "@material-ui/core"
import Bio from "./bio"

const Footer = () => (
  <AppBar position="static" component="footer">
    <Bio />
    <Typography align="center" variant="caption">
      © {new Date().getFullYear()}, Built with{` `}<a href="https://www.gatsbyjs.org">Gatsby</a>
      <p>This website uses Cookie to ensure you get the best experience on this website.</p>
    </Typography>
  </AppBar>
)

export default Footer