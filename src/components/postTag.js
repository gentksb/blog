import React from "react"
import { Link } from "gatsby"

const postTag = ({ tags }) => {
  return (
    tags.map((tag) => (
      <Link to={`/tags/${tag}`}>
        <div>{tag}</div>
      </Link>
    ))
  )
}

export default postTag