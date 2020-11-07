import React from "react"
import { graphql } from "gatsby"
import { Grid } from "@material-ui/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostList from "../components/postList"
import TagList from "../components/tagList"

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges } = data.allMarkdownRemark
  const pageTitle = `Tag search : ${tag} | 幻想サイクル`
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={pageTitle} location={location} />
      <Grid container justify="center">
        <Grid item>
          <TagList targetTag={tag} />
          <PostList props={edges} />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true }, tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(truncate: true)
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            cover {
              childImageSharp {
                fluid {
                  srcSet
                  src
                }
              }
            }
            tags
            draft
          }
        }
      }
    }
  }
`
