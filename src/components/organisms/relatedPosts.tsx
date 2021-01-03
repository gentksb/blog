import React from "react"
import { graphql, useStaticQuery } from "gatsby"

interface Props {
  tag: string
}

const relatedPosts: React.FunctionComponent<Props> = ({tag}) =>{
  const recentPostsData: GatsbyTypes.RecentPostQuery = useStaticQuery<GatsbyTypes.RecentPostQuery>(graphql`
    query RecentPost {
      allMarkdownRemark(limit: 20, sort: {fields: frontmatter___date, order: DESC}) {
        edges {
          node {
            frontmatter {
              title
              tags
            }
            fields {
              slug
            }
            id
          }
        }
      }
    }
  `)

  const relatedRecentPostsData = recentPostsData.allMarkdownRemark.edges.filter( edge => edge.node.frontmatter.tags.includes(tag) === true)
  const maxRelatedPostsCount = 4;

  const relatedRecentPostsElements = (
    relatedRecentPostsData.map( ({node})  => {
      return (
        <>
        </>
        // <Grid item xs={12} key={node.id}>
        //   <Postcard elevation={0} variant="outlined">
        //     <CardActionArea aria-label={node.frontmatter.title}>
        //       <Link to={node.fields.slug} style={{ textDecoration: 'none' }}>
        //         <CardHeader title={node.frontmatter.title} component="h2" style={{padding : '0 16px'}} />
        //       </Link>
        //     </CardActionArea>
        //   </Postcard>
        // </Grid>
      )
    })
  )
  return (
    <>{relatedRecentPostsElements}</>
  )
  }


export default relatedPosts