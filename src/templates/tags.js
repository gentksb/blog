import React from "react"

// Components
import { graphql } from "gatsby"
import { Grid } from "@material-ui/core"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PostList from "../components/postList"


const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`

  return (
    <Layout location={location} title={tagHeader}>
      <SEO title="All posts" location={location} />
      <Grid container justify="center">
        <Grid item>
          <PostList props={edges} />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: {ne: true},tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            cover {
              base
              childImageSharp {
                fluid {
                  originalName
                  srcWebp
                  srcSetWebp
                  srcSet
                  src
                  sizes
                  aspectRatio
                  presentationWidth
                  presentationHeight
                  originalImg
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