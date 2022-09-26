import React from "react"
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
  HatenaShareButton,
  HatenaIcon
} from "next-share"
import shareConfig from "../utils/shareConfig"
import styled from "@emotion/styled"
import { IconButton } from "@chakra-ui/react"
import { FaShareAlt } from "@react-icons/all-files/fa/FaShareAlt"
import { WindowLocation } from "@reach/router"

interface Props {
  location?: WindowLocation
  title?: string
}

const sharebox: React.FunctionComponent<Props> = ({ title, location }) => {
  const ShareBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    margin: 8px 0px 8px 0px;
    padding: 16px;

    .sharebutton-box {
      display: flex;
      margin-left: 10px;
    }
  `

  //モバイル端末で標準の共有APIをコールする
  const kickShareApi = async (shareData) => {
    console.dir(shareData)
    try {
      await navigator.share(shareData)
      console.info("Success sharing", shareData)
    } catch (err) {
      console.error("Error: " + err)
    }
  }

  const shareTitle = `${title}| 幻想サイクル`

  return (
    <ShareBox className="social-share">
      <IconButton
        fontSize="24px"
        variant="none"
        aria-label="share this page"
        icon={<FaShareAlt />}
        onClick={() => {
          kickShareApi({
            title: shareTitle,
            url: location.href
          })
        }}
      />
      <FacebookShareButton url={location.href} className="sharebutton-box">
        <FacebookIcon size={shareConfig.iconSize} round={shareConfig.isRound} />
      </FacebookShareButton>
      <TwitterShareButton
        url={location.href}
        title={shareTitle}
        className="sharebutton-box"
      >
        <TwitterIcon size={shareConfig.iconSize} round={shareConfig.isRound} />
      </TwitterShareButton>
      <HatenaShareButton url={location.href} title={shareTitle}>
        <HatenaIcon
          size={shareConfig.iconSize}
          className="sharebutton-box"
          round={shareConfig.isRound}
          className="sharebutton-box"
        />
      </HatenaShareButton>
      <LineShareButton
        url={location.href}
        title={shareTitle}
        className="sharebutton-box"
      >
        <LineIcon size={shareConfig.iconSize} round={shareConfig.isRound} />
      </LineShareButton>
    </ShareBox>
  )
}

export default sharebox
