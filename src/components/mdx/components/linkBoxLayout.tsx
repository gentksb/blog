import type { OgpData } from "@type/ogpData-type"
import { MdOpenInNew, MdWeb } from "react-icons/md"

interface Props extends OgpData {
  loading?: boolean
}

export const LinkBoxLayout: React.FunctionComponent<Props> = ({
  ogpTitle,
  ogpDescription,
  pageurl,
  ogpImageUrl,
  ogpSiteName,
  loading
}) => {
  const isExternal = !pageurl?.startsWith("https://blog.gensobunya") ?? true
  const altSiteName = pageurl ? new URL(pageurl).hostname : "別ページへ"

  const LinkcCardBody = (
    <>
      <div className="card-body max-w-[75%] p-2">
        <div className="card-title line-clamp-2 text-sm leading-none text-secondary-content md:text-base">
          {isExternal ? <MdOpenInNew className="inline" /> : ""}
          {ogpTitle}
        </div>
        <div className="card-body line-clamp-2 max-h-[3em] p-0 text-xs font-normal text-secondary md:text-sm">
          {ogpDescription}
        </div>
        <div className="text-xs text-secondary md:text-sm">
          <MdWeb className="inline" />
          {ogpSiteName ?? altSiteName}
        </div>
      </div>
      <div className="max-h-28 max-w-[30%] shrink md:max-h-36">
        {loading ? (
          <span className="loading loading-dots loading-lg text-accent" />
        ) : (
          <figure className="h-full w-full object-cover">
            <img
              src={ogpImageUrl ?? ""}
              className="h-full"
              alt="リンク先カバー画像"
            />
          </figure>
        )}
      </div>
    </>
  )

  const NoImageCardBody = (
    <div className="card-body w-full p-2">
      <div className="card-title line-clamp-2 text-sm leading-none text-secondary-content md:text-base">
        <MdOpenInNew className="inline" />
        {ogpTitle}
      </div>
      <div className="card-body line-clamp-2 max-h-[3em] p-0 text-xs font-normal text-secondary md:text-sm">
        {ogpDescription}
      </div>
      <div className="text-xs text-secondary md:text-sm">
        <MdWeb className="inline" />
        {ogpSiteName ?? "別ページへ"}
      </div>
    </div>
  )

  return (
    <a
      href={pageurl}
      className="link-hover link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="not-prose card card-side mx-2 mt-2 rounded-none border border-base-300 bg-base-100">
        {ogpImageUrl ? LinkcCardBody : NoImageCardBody}
      </div>
    </a>
  )
}
