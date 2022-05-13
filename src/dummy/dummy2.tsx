// gatsby-plugin-typegenがgatsby-node.tsの型生成をサポートするまで、型生成のためにここでダミークエリを書く

import React from "react"
import { graphql } from "gatsby"

const dummy2: React.FunctionComponent = () => {
  return <></>
}

export const tagsQuery = graphql`
  query AllTagNodeDummy {
    allMdx {
      group(field: frontmatter___tags) {
        fieldValue
      }
    }
  }
`
export default dummy2
