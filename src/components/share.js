import React from "react"
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
} from "react-share";
import shareConfig from "../config/shareConfig"
import styled from "@emotion/styled"
import { Share } from "@material-ui/icons"

const sharebox = ({ post, location }) => {

  const ShareBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    margin: 8px 0px 8px 0px;

    .sharebutton-box{
      display: flex;
      margin-left: 10px;
    }
  `

  return (
    <ShareBox className="social-share">
      <Share />
      <FacebookShareButton url={location.href} className="sharebutton-box">
        <FacebookIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </FacebookShareButton>
      <TwitterShareButton url={location.href} title={post.frontmatter.title + "| 幻想サイクル"} className="sharebutton-box">
        <TwitterIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </TwitterShareButton>
      <LineShareButton url={location.href} title={post.frontmatter.title + "| 幻想サイクル"} className="sharebutton-box">
        <LineIcon size={shareConfig.iconSize} round={shareConfig.isRoundIcon} />
      </LineShareButton>
    </ShareBox>
  )
}

export default sharebox
