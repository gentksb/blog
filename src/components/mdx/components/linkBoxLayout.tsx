import type { OgpData } from "../../../../@types/ogpData-type"
import { MdOpenInNew, MdWeb } from "react-icons/md"

interface Props extends OgpData {
  loading?: boolean
}

export const LinkBoxLayout: React.FunctionComponent<Props> = ({
  ogpTitle,
  ogpDescription,
  pageurl,
  ogpImageUrl,
  loading
}) => {
  const isExternal = !pageurl?.startsWith("https://blog.gensobunya") ?? true
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
          <div className="text-md card-title line-clamp-2 text-sm leading-none text-secondary-focus md:text-base">
            {isExternal ? <MdOpenInNew className="inline" /> : ""}
            {ogpTitle}
          </div>
          <div className="card-body line-clamp-2 max-h-[3em] p-0 text-xs font-normal text-secondary md:text-sm">
            {ogpDescription}
          </div>
          <div className="card-subtitle text-xs text-secondary md:text-sm">
            <MdWeb className="inline" />
            {hostname}
          </div>
        </div>
        <div className="max-h-28 max-w-[30%] shrink md:max-h-36">
          {loading ? (
            <span className="loading loading-dots loading-lg text-accent" />
          ) : (
            <figure className="h-full w-full object-cover">
              <img src={ogpImageUrl ?? ""} className="h-full" />
            </figure>
          )}
        </div>
      </div>
    </a>
  )
}
