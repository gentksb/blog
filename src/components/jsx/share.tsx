import React from "react"
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

  return (
    <div className="flex justify-center items-center gap-4">
      <span className="text-sm font-medium text-gray-700">この記事をシェア</span>
      <div className="flex gap-2">
        <button
          className="p-2 rounded-full text-white"
          style={{ backgroundColor: "#1DA1F2" }}
          onClick={async () => {
            await kickShareApi({
              title: shareTitle,
              url: url
            })
          }}
          aria-label="share this page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
        </button>
        <TwitterShareButton url={url} title={shareTitle} blankTarget>
          <div className="p-2 rounded-full text-white" style={{ backgroundColor: "#1DA1F2" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </div>
        </TwitterShareButton>
        <FacebookShareButton url={url} className="flex" blankTarget>
          <div className="p-2 rounded-full text-white" style={{ backgroundColor: "#4267B2" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </div>
        </FacebookShareButton>
        <LineShareButton url={url} title={shareTitle} blankTarget>
          <div className="p-2 rounded-full text-white" style={{ backgroundColor: "#00C300" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </div>
        </LineShareButton>
      </div>
    </div>
  )
}
