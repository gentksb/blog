import React from "react"
import { Link, graphql } from "gatsby"
import Image from 'gatsby-image';

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import styled from "styled-components"

const ThumbnailBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`


class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <article key={node.fields.slug}>
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.excerpt,
                  }}
                />
              </section>
              <ThumbnailBox>
                {node.frontmatter.featuredImage==null ? "" : <Image fluid={node.frontmatter.featuredImage.childImageSharp.fluid} />}
              </ThumbnailBox>
            </article>
          )
        })}
        <Bio />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          featuredImage {
            childImageSharp {
              fluid(maxWidth: 600, quality: 80) {
                src
              }
            }
            publicURL
          }
        }
      }
    }
  }
}
`
