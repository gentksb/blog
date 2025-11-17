import { useState } from "react"

interface Props {
  content: string
}

export default function CopyMarkdown({ content }: Props) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  const processMarkdown = (markdown: string): string => {
    let processed = markdown

    // LinkCardコンポーネントを削除（<LinkCard url="..." /> 形式）
    processed = processed.replace(/<LinkCard\s+url=["'][^"']*["']\s*\/>/g, "")

    // Amznコンポーネントを削除（<Amzn asin="..." /> 形式）
    processed = processed.replace(/<Amzn\s+asin=["'][^"']*["']\s*\/>/g, "")

    // 空行を削除（3行以上の連続した空行を2行に）
    processed = processed.replace(/\n{3,}/g, "\n\n")

    return processed.trim()
  }

  const handleCopy = async () => {
    try {
      const processedContent = processMarkdown(content)
      await navigator.clipboard.writeText(processedContent)
      setCopied(true)
      setError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <>
      <button
        onClick={handleCopy}
        className="btn btn-outline btn-sm mb-4"
        type="button"
      >
        {error ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            コピー失敗
          </>
        ) : copied ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            コピーしました
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy as Markdown
          </>
        )}
      </button>

      {/* スクリーンリーダー用のステータス通知 */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {copied && "Markdownをクリップボードにコピーしました"}
        {error && "クリップボードへのコピーに失敗しました"}
      </div>
    </>
  )
}
