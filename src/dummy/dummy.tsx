// gatsby-plugin-typegenがgatsby-node.tsの型生成をサポートするまで、型生成のためにここでダミークエリを書く

import React from "react"
import { graphql } from "gatsby"

const dummy: React.FunctionComponent = () => {
  return <></>
}

export const allPostNodeQuery = graphql`
  query AllPostNodeDummy {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`

export const tagsQuery = graphql`
  query AllTagNodeDummy {
    allMdx {
      group(field: frontmatter___tags) {
        fieldValue
      }
    }
  }
`
export default dummy
