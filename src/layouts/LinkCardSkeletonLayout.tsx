interface Props {
  url: string
}

export const LinkCardSkeltonLayout = ({ url }: Props) => (
  <a
    href={url}
    className="hover:underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div
      className={`not-prose mx-2 mt-2 flex overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm`}
    >
      <div className="flex w-[70%] flex-col justify-center p-2">
        <div className="line-clamp-2 text-sm leading-none text-stone-800 md:text-base">
          {/* スケルトンタイトル */}
          <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200 md:h-6"></div>
        </div>
        <div className="mt-1 line-clamp-2 max-h-[3em] text-xs font-normal text-secondary md:text-sm">
          {/* スケルトン説明 */}
          <div className="h-4 w-full animate-pulse rounded bg-stone-200 md:h-6"></div>
        </div>
        <div className="mt-1 text-xs text-secondary md:text-sm">
          {/* スケルトンサイト名 */}
          <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200 md:h-6"></div>
        </div>
      </div>
      <div className="h-28 w-[30%] shrink md:h-36">
        <div className="size-full animate-pulse rounded bg-stone-200"></div>
      </div>
    </div>
  </a>
)
