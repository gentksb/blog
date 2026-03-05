import type React from "react"
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
    singleLine: "border-stone-200",
    default: "border-stone-200"
  }
  const brandColorBackground: { [key: string]: string } = {
    amazon: "bg-amazon",
    rakuten: "bg-rakuten",
    yahoo: "bg-yahoo",
    singleLine: "bg-stone-200",
    default: "bg-stone-200"
  }
  const defaultLayout = (
    <a
      href={url}
      className="hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className={`not-prose relative mx-2 mt-2 flex overflow-hidden rounded-lg border bg-white shadow-sm ${brandColorBorder[theme]}`}
      >
        <div className="flex max-w-[70%] flex-col justify-center p-2">
          {showBadge ? (
            <div
              className={`absolute right-0 top-0 ${brandColorBackground[theme]} rounded-bl px-2 py-1 text-xs text-white`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </div>
          ) : (
            ""
          )}
          <div className="line-clamp-2 text-sm font-bold leading-none text-stone-800 md:text-base">
            {isExternal ? <MdOpenInNew className="inline" /> : ""}
            {title}
          </div>
          <div className="mt-1 line-clamp-2 max-h-[3em] text-xs font-normal text-secondary md:text-sm">
            {description}
          </div>
          <div className="mt-1 text-xs text-secondary md:text-sm">
            <MdWeb className="inline" />
            {siteName}
          </div>
        </div>
        <div className="max-h-28 max-w-[30%] shrink md:max-h-36">
          {imageSrc === undefined ? (
            ""
          ) : (
            <figure className="size-full object-contain">
              <img
                src={imageSrc}
                className="h-full"
                alt="リンク先カバー画像"
                loading="lazy"
              />
            </figure>
          )}
        </div>
      </div>
    </a>
  )

  return defaultLayout
}
