import React, { type ReactNode } from "react"
import { MdMood } from "react-icons/md"

interface Props {
  children: ReactNode
}

export const PositiveBox: React.FC<Props> = ({ children }) => {
  return (
    <div className="p-2">
      <div className="flex flex-col items-center rounded-lg border bg-info pt-2">
        <MdMood className="h-8 w-8" />
        <div>{children}</div>
      </div>
    </div>
  )
}
