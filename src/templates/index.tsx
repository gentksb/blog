import React from "react"
import { PageProps, graphql } from "gatsby"
import { Grid } from "@material-ui/core"
import { IndexPageQuery,SitePageContext } from '../../types/graphql-types'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Pagination from "../components/pagination"
import PostList from "../components/postList"
import TagList from "../components/molecules/tagList"

const BlogIndex: React.FunctionComponent<PageProps<IndexPageQuery, SitePageContext>> = (props) => {
  const { data, location } = props
  const siteTitle = data.site.siteMetadata.title
  const edges = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Top" location={location} />
      <Grid container justify="center">
        <Grid item>
          <PostList props={edges} />
          <Pagination props={props.pageContext} />
          <TagList />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexPage($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
      filter: { frontmatter: { draft: { eq: false } } }
    ) {
      edges {
        node {
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
