import React from "react"
import { MdOpenInNew, MdWeb } from "react-icons/md"

interface Props {
  title: string
  description: string
  siteName: string
  imageSrc?: string
  url: string
  theme?: "amazon" | "rakuten" | "yahoo" | "singleLine"
}

export const LinkCardLayout: React.FC<Props> = ({
  title,
  description,
  siteName,
  imageSrc,
  url,
  theme = "default"
}) => {
  const isExternal = new URL(url).hostname !== "blog.gensobunya.net"
  const showBadge =
    theme === "amazon" || theme === "rakuten" || theme === "yahoo"
  const brandColorBorder: { [key: string]: string } = {
    amazon: "border-amazon border-3",
    rakuten: "border-rakuten border-3",
    yahoo: "border-yahoo border-3",
    singleLine: "border-base-300",
    default: "border-base-300"
  }
  const brandColorBackground: { [key: string]: string } = {
    amazon: "bg-amazon",
    rakuten: "bg-rakuten",
    yahoo: "bg-yahoo",
    singleLine: "bg-base-300",
    default: "bg-base-300"
  }
  const defaultLayout = (
    <a
      href={url}
      className="link-hover link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className={`not-prose card card-side mx-2 mt-2 rounded-none border bg-base-100 ${brandColorBorder[theme]}`}
      >
        <div className="card-body max-w-[70%] p-2">
          {showBadge ? (
            <div
              className={`absolute right-0 top-0 ${brandColorBackground[theme]} rounded-bl px-2 py-1 text-xs text-white`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </div>
          ) : (
            ""
          )}
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
          <figure className="size-full object-contain">
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

  return defaultLayout
}
