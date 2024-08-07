import React from "react"

interface Props {
  url: string
}

export const LinkCardSkeltonLayout = ({ url }: Props) => (
  <a
    href={url}
    className="link-hover link"
    target="_blank"
    rel="noopener noreferrer"
  >
    {" "}
    <div
      className={`not-prose card card-side mx-2 mt-2 rounded-none border bg-base-100`}
    >
      <div className="card-body w-[70%] p-2">
        <div className="card-title line-clamp-2 text-sm leading-none text-secondary-content md:text-base">
          {/* スケルトンタイトル */}
          <div className="skeleton h-4 w-3/4 md:h-6"></div>
        </div>
        <div className="card-body line-clamp-2 max-h-[3em] p-0 text-xs font-normal text-secondary md:text-sm">
          {/* スケルトン説明 */}
          <div className="skeleton h-4 w-full md:h-6"></div>
        </div>
        <div className="text-xs text-secondary md:text-sm">
          {/* スケルトンサイト名 */}
          <div className="skeleton h-4 w-1/2 md:h-6"></div>
        </div>
      </div>
      <div className="h-28 w-[30%] shrink md:h-36">
        <div className="skeleton size-full"></div>
      </div>
    </div>
  </a>
)
