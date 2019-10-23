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

const sharebox = ({ props }) => {

  return (
    <Container>
      <FacebookShareButton>
        <FacebookIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </FacebookShareButton>
      <TwitterShareButton title={props.frontmatter.title}>
        <TwitterIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </TwitterShareButton>
      <LineShareButton>
        <LineIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </LineShareButton>
    </Container>
  )
}

export default sharebox
