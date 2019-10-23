import React from "react"
import { Link, graphql } from "gatsby"
import { Typography, Container, Card, CardHeader, CardContent, Chip } from '@material-ui/core'
import { LocalOffer } from '@material-ui/icons';

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Share from "../components/share"
import PostTag from "../components/postTag"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} image={post.frontmatter.cover.childImageSharp.fluid.src} />
        <Container maxWidth="lg">
          <Card component="article">
            <CardHeader component="header" title={post.frontmatter.title} subheader={post.frontmatter.date} />
            {post.frontmatter.tags != null ? (
              <PostTag tags={post.frontmatter.tags} />
            ) : (
                <Chip label="No tags" size="small" icon={<LocalOffer />} />
              )}
            <CardContent>
              <Typography variant="body1" component="section" dangerouslySetInnerHTML={{ __html: post.html }} />
            </CardContent>
            <hr />
            <footer>
              <Share props={post} />
              <Bio />
            </footer>
          </Card>

          <nav>
            <ul
              style={{
                display: `flex`,
                flexWrap: `wrap`,
                justifyContent: `space-between`,
                listStyle: `none`,
                padding: 0,
              }}
            >
              <li>
                {previous && (
                  <Link to={previous.fields.slug} rel="prev">
                    ← {previous.frontmatter.title}
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={next.fields.slug} rel="next">
                    {next.frontmatter.title} →
                </Link>
                )}
              </li>
            </ul>
          </nav>
        </Container>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(truncate: true)
      html
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
`
