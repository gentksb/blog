import React, { type ReactNode } from "react"
import {
  FacebookShareButton,
  // TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
  HatenaShareButton,
  HatenaIcon
} from "next-share"
import { MdShare } from "react-icons/md"

interface Props {
  url: string
  title: string
}

export const SocialShare: React.FunctionComponent<Props> = ({ title, url }) => {
  const shareConfig = {
    iconSize: 32,
    isRound: true
  }

  //モバイル端末で標準の共有APIをコールする
  const kickShareApi = async (shareData: Props) => {
    console.dir(shareData)
    try {
      await navigator.share(shareData)
      console.info("Success sharing", shareData)
    } catch (err) {
      console.error("Error: " + err)
    }
  }

  const shareTitle = `${title} - 幻想サイクル`
  const twitterShareTitle = encodeURIComponent(shareTitle)

  const ButtonWrapper = ({ children }: { children: ReactNode }) => {
    return <div className="flex md:ml-4">{children}</div>
  }

  return (
    <div className="my-2 flex flex-wrap items-center justify-center p-4">
      <button
        className="btn btn-circle text-base"
        aria-label="share this page"
        onClick={() => {
          kickShareApi({
            title: shareTitle,
            url: url
          })
        }}
      >
        <MdShare className="h-[32px] w-[32px]" />
      </button>
      <ButtonWrapper>
        <a
          target="_blank"
          href={`https://twitter.com/intent/tweet?text=${twitterShareTitle}&url=${url}`}
          rel="noopener noreferrer"
        >
          <TwitterIcon round={shareConfig.isRound} />
        </a>
      </ButtonWrapper>
      <ButtonWrapper>
        <FacebookShareButton url={url} className="ml-8 flex" blankTarget>
          <FacebookIcon round={shareConfig.isRound} />
        </FacebookShareButton>
      </ButtonWrapper>

      <ButtonWrapper>
        <HatenaShareButton
          url={url}
          title={shareTitle}
          className="ml-8 flex"
          blankTarget
        >
          <HatenaIcon round={shareConfig.isRound} />
        </HatenaShareButton>
      </ButtonWrapper>

      <ButtonWrapper>
        <LineShareButton
          url={url}
          title={shareTitle}
          className="ml-8 flex"
          blankTarget
        >
          <LineIcon round={shareConfig.isRound} />
        </LineShareButton>
      </ButtonWrapper>
    </div>
  )
}
