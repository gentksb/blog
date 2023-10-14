import type { OgpData } from "../../../../@types/ogpData-type"
import { MdOpenInNew, MdWeb } from "react-icons/md"

export const LinkBoxLayout: React.FunctionComponent<OgpData> = ({
  ogpTitle,
  ogpDescription,
  pageurl,
  ogpImageUrl
}) => {
  const isExternal = !(pageurl?.startsWith("https://blog.gensobunya")) ?? true
  const hostname = pageurl ? new URL(pageurl).hostname : ""

  return (
  <a
    href={pageurl}
    className="link-hover link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="not-prose card card-side mx-2 rounded-none border border-base-300 bg-base-100">
      <div className="card-body p-2">
        <div className="card-title text-sm md:text-base leading-none text-md text-secondary-focus line-clamp-2">{isExternal? <MdOpenInNew className="inline" /> : ""}{ogpTitle}</div>
        <div className="card-body p-0 text-secondary line-clamp-2 max-h-[3em] text-xs md:text-sm font-normal">
          {ogpDescription}
        </div>
        <div className="card-subtitle text-xs md:text-sm text-secondary">
          <MdWeb className="inline" />
          {hostname}
        </div>
      </div>
      <div className="max-h-28 md:max-h-36 max-w-[30%] shrink">
        <figure className="h-full w-full object-cover">
          <img src={ogpImageUrl ?? ""} className="h-full" />
        </figure>
      </div>
    </div>
  </a>
)
}