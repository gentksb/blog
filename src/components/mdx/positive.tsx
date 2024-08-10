import React, { type ReactNode } from "react"
import { MdMood } from "react-icons/md"

interface Props {
  children: ReactNode
}

export const PositiveBox: React.FC<Props> = ({ children }) => {
  return (
    <div className="p-2">
      <div className="flex flex-col items-center rounded-lg border bg-info/50 pt-2">
        <MdMood className="size-8" />
        <div>{children}</div>
      </div>
    </div>
  )
}
