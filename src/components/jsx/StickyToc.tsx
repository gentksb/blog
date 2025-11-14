import { useEffect, useState } from "react"

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

  // h2とh3のみを表示
  const filteredHeadings = headings.filter((h) => h.depth === 2 || h.depth === 3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
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
    <nav className="sticky top-4 hidden xl:block">
      <div className="mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-sm font-bold text-gray-700">目次</h2>
      </div>
      <ul className="space-y-2 text-sm">
        {filteredHeadings.map((heading) => {
          const isActive = activeId === heading.slug
          return (
            <li key={heading.slug} className={getIndentClass(heading.depth)}>
              <a
                href={`#${heading.slug}`}
                className={`block transition-colors ${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
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
