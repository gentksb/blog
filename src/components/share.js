import React from "react"
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
} from "react-share";
import { Container } from "@material-ui/core"
import shareConfig from "../config/shareConfig"

const sharebox = ({ post, location }) => {

  return (
    <Container>
      <FacebookShareButton url={location.href}>
        <FacebookIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </FacebookShareButton>
      <TwitterShareButton url={location.href} title={post.frontmatter.title}>
        <TwitterIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </TwitterShareButton>
      <LineShareButton url={location.href}>
        <LineIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </LineShareButton>
    </Container>
  )
}

export default sharebox
