export const MdxParagraph: React.FC<JSX.IntrinsicElements["p"]> = (props) => {
  return <p {...props} />
}

export const MdxH2: React.FC<JSX.IntrinsicElements["h2"]> = (props) => {
  return (
    <h2
      {...props}
      className="my-8 border-l-4 border-accent py-1 pl-4 text-xl font-bold text-gray-800"
    />
  )
}

export const MdxH3: React.FC<JSX.IntrinsicElements["h3"]> = (props) => {
  return (
    <h3
      {...props}
      className="my-6 border-b border-gray-300 pb-2 text-lg font-semibold text-gray-800"
    />
  )
}

export const MdxH4: React.FC<JSX.IntrinsicElements["h4"]> = (props) => {
  return (
    <h4 {...props} className="my-4 text-base font-semibold text-gray-800" />
  )
}

export const MdxBlockQuote: React.FC<JSX.IntrinsicElements["blockquote"]> = (
  props
) => {
  return (
    <blockquote
      {...props}
      className="mx-4 border-l-4 border-amber-300 bg-amber-50 px-4 py-3 italic"
    />
  )
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
      className="font-bold underline decoration-amber-400/40 decoration-4"
    />
  )
}
