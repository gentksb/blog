export const MdxParagraph: React.FC<JSX.IntrinsicElements["p"]> = (props) => {
  return <p {...props} />
}

export const MdxH2: React.FC<JSX.IntrinsicElements["h2"]> = (props) => {
  return <h2 {...props} className="text-accent-content p-2 text-xl font-bold" />
}

export const MdxH3: React.FC<JSX.IntrinsicElements["h3"]> = (props) => {
  return (
    <h3
      {...props}
      className="text-accent-content not-prose text-md mx-1 p-2 font-bold"
    />
  )
}

export const MdxH4: React.FC<JSX.IntrinsicElements["h4"]> = (props) => {
  return (
    <h4 {...props} className="text-accent-content p-2 text-base font-bold" />
  )
}

export const MdxBlockQuote: React.FC<JSX.IntrinsicElements["blockquote"]> = (
  props
) => {
  return <blockquote {...props} className="bg-base-300 mx-4" />
}

export const MdxA: React.FC<JSX.IntrinsicElements["a"]> = (props) => {
  return <a {...props} className="text-primary hover:underline" />
}

export const MdxTable: React.FC<JSX.IntrinsicElements["table"]> = (props) => {
  return (
    <div className="overflow-x-auto bg-white">
      <table {...props} className="m-2 table-auto" />
    </div>
  )
}

export const MdxStrong: React.FC<JSX.IntrinsicElements["strong"]> = (props) => {
  return (
    <strong
      {...props}
      className="decoration-info/30 font-bold underline decoration-4"
    />
  )
}
