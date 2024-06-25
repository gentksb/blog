import React, { type ReactNode } from "react"
import {
  FacebookShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
  HatenaShareButton,
  HatenaIcon,
  TwitterShareButton
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

  const ButtonWrapper = ({ children }: { children: ReactNode }) => {
    return <div className="text-center">{children}</div>
  }

  return (
    <div className="my-2 grid grid-cols-5 content-center justify-center gap-2 p-4">
      <div className="my-auto text-center">
        <button
          className="btn btn-circle text-base"
          aria-label="share this page"
          onClick={async () => {
            await kickShareApi({
              title: shareTitle,
              url: url
            })
          }}
        >
          <MdShare className="size-[32px]" />
        </button>
      </div>
      <ButtonWrapper>
        <TwitterShareButton url={url} title={shareTitle} blankTarget>
          <TwitterIcon round={shareConfig.isRound} />
        </TwitterShareButton>
      </ButtonWrapper>
      <ButtonWrapper>
        <FacebookShareButton url={url} className="flex" blankTarget>
          <FacebookIcon round={shareConfig.isRound} />
        </FacebookShareButton>
      </ButtonWrapper>
      <ButtonWrapper>
        <HatenaShareButton url={url} title={shareTitle} blankTarget>
          <HatenaIcon round={shareConfig.isRound} />
        </HatenaShareButton>
      </ButtonWrapper>

      <ButtonWrapper>
        <LineShareButton url={url} title={shareTitle} blankTarget>
          <LineIcon round={shareConfig.isRound} />
        </LineShareButton>
      </ButtonWrapper>
    </div>
  )
}
