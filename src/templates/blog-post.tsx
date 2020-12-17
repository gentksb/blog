import React from "react"
import { PageProps,graphql } from "gatsby"
import { Typography, Paper, CardContent, Divider } from "@material-ui/core"
import { Today } from "@material-ui/icons"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Share from "../components/share"
import PostTag from "../components/postTag"
import PrevAndNextPost from "../components/prevAndNextpost"
import BlogPostStyle from "../styles/blog-post.style"
import TagList from "../components/tagList"
import { BlogPostBySlugQuery,SitePageContext } from "../../types/graphql-types"

const BlogPostTemplate: React.FunctionComponent<PageProps<BlogPostBySlugQuery, SitePageContext>> = (props) => {
  const { pageContext, data, location } = props
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const seoImage =
    post.frontmatter.cover != null
      ? post.frontmatter.cover.childImageSharp.fluid.src
      : "/image/dummy.jpg"

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        image={seoImage}
        location={location}
      />
      <BlogPostStyle />
      <Paper elevation={0}>
        <article>
          <CardContent>
            <header>
              <time dateTime={post.frontmatter.date}>
                <Typography
                  component="div"
                  variant="subtitle1"
                  color="textSecondary"
                >
                  <Today fontSize="small" />
                  {post.frontmatter.date}
                </Typography>
              </time>
              <Typography component="h1" variant="h4">
                {post.frontmatter.title}
              </Typography>
              <PostTag tags={post.frontmatter.tags} />
            </header>
            <Divider variant="fullWidth" />
            <Typography
              variant="body1"
              component="div"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </CardContent>
        </article>
        <Divider variant="middle" />
        <Share title={post.frontmatter.title} location={location} />
      </Paper>
      <nav>
        <PrevAndNextPost previous={previous} next={next} />
      </nav>
      <TagList />
    </Layout>
  )
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
`
