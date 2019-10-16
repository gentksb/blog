import { Link } from "gatsby"
import React from "react"

const Pagination = ({ props }) => {
  const { pageContext } = props
  const { previousPagePath, nextPagePath } = pageContext

  return (
    <div>
      {previousPagePath ? <Link to={previousPagePath}>Newer</Link> : null}
      {nextPagePath ? <Link to={nextPagePath}>Older</Link> : null}
    </div>
  )
}

export default Pagination
