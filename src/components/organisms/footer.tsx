import React from "react"
import { AppBar, Typography } from "@material-ui/core"
import Bio from "../molecules/bio"

const Footer: React.FunctionComponent = () => (
  <AppBar position="static" component="footer">
    <Bio />
    <Typography align="center" variant="caption">
      © {new Date().getFullYear()}, Built with{` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a>
      <p>
        This website uses Cookie to ensure you get the best experience on this
        website.
      </p>
      <a href="https://blogmura.com/profiles/11085449?p_cid=11085449">
        <img src="https://blogparts.blogmura.com/parts_image/user/pv11085449.gif" alt="PVアクセスランキング にほんブログ村" />
      </a>
    </Typography>
  </AppBar>
)

export default Footer
