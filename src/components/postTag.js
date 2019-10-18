import React from "react"
import { Link } from "gatsby"

const postTag = ({ tags }) => {
  return (
    tags.map((tag) => (
      <div key={tag}><Link to={`/tags/${tag.toLowerCase()}`}>
        {tag}
      </Link>
      </div>
    ))
  )
}

export default postTag