import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import PostTag from "./postTag"

const postList = ({ props }) => {
  return (
    props.map(({ node }) => (
      <div key={node.id}>
        <Link to={node.fields.slug}>
          <h3>{node.frontmatter.title}</h3>
          {node.frontmatter.cover != null ? (
            <Img
              alt={`${node.frontmatter.title} cover image`}
              style={{ height: "100%" }}
              fluid={node.frontmatter.cover.childImageSharp.fluid}
            />
          ) : (
              <img src="/image/dummy.jpg" alt="no cover" />
            )}
        </Link>
        <p>{node.frontmatter.date}</p>
        <p>{node.excerpt}</p>
        {node.frontmatter.tags != null ? (
          <PostTag tags={node.frontmatter.tags} />
        ) : (
            "No Tags"
          )}

      </div>
    ))
  )
}

export default postList