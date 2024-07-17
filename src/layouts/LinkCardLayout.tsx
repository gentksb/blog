import React from "react"
import { MdOpenInNew, MdWeb } from "react-icons/md"

interface Props {
  title: string
  description: string
  siteName: string
  imageSrc?: string
  url: string
}

export const LinkCardLayout: React.FC<Props> = ({
  title,
  description,
  siteName,
  imageSrc,
  url
}) => {
  const isExternal = new URL(url).hostname !== "blog.gensobunya.net"

  return (
    <a
      href={url}
      className="link-hover link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="not-prose card card-side mx-2 mt-2 rounded-none border border-base-300 bg-base-100">
        <div className="card-body max-w-[75%] p-2">
          <div className="card-title line-clamp-2 text-sm leading-none text-secondary-content md:text-base">
            {isExternal ? <MdOpenInNew className="inline" /> : ""}
            {title}
          </div>
          <div className="card-body line-clamp-2 max-h-[3em] p-0 text-xs font-normal text-secondary md:text-sm">
            {description}
          </div>
          <div className="text-xs text-secondary md:text-sm">
            <MdWeb className="inline" />
            {siteName}
          </div>
        </div>
        <div className="max-h-28 max-w-[30%] shrink md:max-h-36">
          <figure className="size-full object-cover">
            <img
              src={imageSrc}
              className="h-full"
              alt="リンク先カバー画像"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </a>
  )
}
