import { useEffect, useMemo, useState } from "react"

interface Heading {
  depth: number
  slug: string
  text: string
}

interface Props {
  headings: Heading[]
}

export default function StickyToc({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>("")

  // h2とh3のみを表示（メモ化して再レンダリングを防ぐ）
  const filteredHeadings = useMemo(
    () => headings.filter((h) => h.depth === 2 || h.depth === 3),
    [headings]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 交差している要素のみを抽出
        const intersectingEntries = entries.filter((entry) => entry.isIntersecting)

        if (intersectingEntries.length > 0) {
          // 複数の見出しが同時に交差する場合、最も上の見出しを選択
          const topEntry = intersectingEntries.reduce((prev, current) => {
            const prevTop = prev.boundingClientRect.top
            const currentTop = current.boundingClientRect.top
            return currentTop < prevTop ? current : prev
          })

          setActiveId(topEntry.target.id)
        }
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 1
      }
    )

    // すべての見出し要素を監視
    const headingElements = filteredHeadings.map((heading) =>
      document.getElementById(heading.slug)
    )

    headingElements.forEach((element) => {
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headingElements.forEach((element) => {
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [filteredHeadings])

  if (filteredHeadings.length === 0) {
    return null
  }

  const getIndentClass = (depth: number): string => {
    return depth === 3 ? "pl-4" : ""
  }

  return (
    <nav className="sticky top-24 hidden xl:block" aria-labelledby="toc-heading">
      <div className="mb-4 border-b border-gray-200 pb-2">
        <h2 id="toc-heading" className="text-sm font-bold text-gray-700">
          目次
        </h2>
      </div>
      <ul className="space-y-2 text-sm">
        {filteredHeadings.map((heading) => {
          const isActive = activeId === heading.slug
          return (
            <li key={heading.slug} className={getIndentClass(heading.depth)}>
              <a
                href={`#${heading.slug}`}
                className={`block transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:rounded ${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                aria-current={isActive ? "location" : undefined}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
