import React from "react"

// Components
import { graphql } from "gatsby"
import Bio from "../components/bio"
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
      <SEO title="All posts" />
      <PostList props={edges} />
      <Bio />
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
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            cover {
              base
              childImageSharp {
                fluid(maxWidth: 1080) {
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
          }
        }
      }
    }
  }
`