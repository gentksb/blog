export const MdxParagraph: React.FC<JSX.IntrinsicElements["p"]> = (props) => {
  return <p {...props} className="px-5" />
}

export const MdxH2: React.FC<JSX.IntrinsicElements["h2"]> = (props) => {
  return (
    <h2
      {...props}
      className="my-4 border-l-4 border-accent bg-accent/20 p-2 text-xl font-bold text-gray-700"
    />
  )
}

export const MdxH3: React.FC<JSX.IntrinsicElements["h3"]> = (props) => {
  return (
    <h3
      {...props}
      className="mx-1 my-4 border-b-2 border-l-4 border-accent p-2 text-lg font-bold text-gray-700"
    />
  )
}

export const MdxH4: React.FC<JSX.IntrinsicElements["h4"]> = (props) => {
  return (
    <h4
      {...props}
      className="my-4 border-l-4 border-accent p-2 text-base font-bold text-gray-700"
    />
  )
}

export const MdxBlockQuote: React.FC<JSX.IntrinsicElements["blockquote"]> = (
  props
) => {
  return <blockquote {...props} className="mx-4 bg-base-300" />
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
      className="font-bold underline decoration-info/30 decoration-4"
    />
  )
}
