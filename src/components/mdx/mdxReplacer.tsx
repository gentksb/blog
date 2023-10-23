import React, { type ReactNode } from "react"

interface Props {
  children: ReactNode
}

export const MdxParagraph: React.FC<Props> = ({ children }) => {
  return <p className="px-5">{children}</p>
}

export const MdxH2: React.FC<Props> = ({ children }) => {
  return (
    <h2 className="my-4 bg-accent p-2 text-xl font-bold text-accent-content">
      {children}
    </h2>
  )
}

export const MdxH3: React.FC<Props> = ({ children }) => {
  return (
    <h3 className="mx-1 my-4 border-b-2 border-l-4 border-accent p-2 text-lg font-bold text-accent-content">
      {children}
    </h3>
  )
}

export const MdxH4: React.FC<Props> = ({ children }) => {
  return (
    <h4 className="my-4 border-l-4 border-accent p-2 text-base font-bold text-accent-content">
      {children}
    </h4>
  )
}

export const MdxBlockQuote: React.FC<Props> = ({ children }) => {
  return <blockquote className="mx-4 bg-base-300">{children}</blockquote>
}

export const MdxA: React.FC<Props> = ({ children }) => {
  return <a className="text-primary hover:underline">{children}</a>
}

export const MdxTable: React.FC<Props> = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto">{children}</table>
    </div>
  )
}

export const MdxStrong: React.FC<Props> = ({ children }) => {
  return (
    <strong className="font-bold underline decoration-info/30 decoration-4">
      {children}
    </strong>
  )
}
