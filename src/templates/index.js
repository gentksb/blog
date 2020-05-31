import React from "react"
import { graphql } from "gatsby"
import { Grid } from "@material-ui/core"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Pagination from "../components/pagination"
import PostList from "../components/postList"
import TagList from "../components/tagList"

const BlogIndex = (props) => {
  const { data, location } = props
  const siteTitle = data.site.siteMetadata.title
  const edges = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Top" location={location} />
      <Grid container justify="center">
        <Grid item>
          <PostList props={edges} />
          <Pagination props={props} />
          <TagList />
        </Grid>
      </Grid>
    </Layout>
  )
}


export default BlogIndex

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
      filter: {frontmatter: {draft: {eq: false}}}
    ) {
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
                ...GatsbyImageSharpFluid
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
