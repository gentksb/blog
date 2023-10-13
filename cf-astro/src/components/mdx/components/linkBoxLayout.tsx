import type { OgpData } from "../../../../@types/ogpData-type"

export const LinkBoxLayout: React.FunctionComponent<OgpData> = ({
  ogpTitle,
  ogpDescription,
  pageurl,
  ogpImageUrl
}) => (
  <a
    href={pageurl}
    className="link-hover link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="not-prose card card-side mx-2 rounded-none border border-base-300 bg-base-100">
      <div className="card-body p-2">
        <span className="card-title text-base leading-none">{ogpTitle}</span>
        <div className="card-subtitle text-gray line-clamp-2 text-xs font-normal">
          {ogpDescription}
        </div>
      </div>
      <div className="max-h-24 max-w-[30%] shrink">
        <figure className="h-full w-full object-cover">
          <img src={ogpImageUrl ?? ""} className="h-full" />
        </figure>
      </div>
    </div>
  </a>
)
