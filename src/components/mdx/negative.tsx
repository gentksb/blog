import React, { type ReactNode } from "react"
import { MdMoodBad } from "react-icons/md"

interface Props {
  children: ReactNode
}

export const NegativeBox: React.FC<Props> = ({ children }) => {
  return (
    <div className="p-2">
      <div className="flex flex-col items-center rounded-lg border bg-warning pt-2">
        <MdMoodBad className="h-8 w-8" />
        <div className="pt-1">{children}</div>
      </div>
    </div>
  )
}
