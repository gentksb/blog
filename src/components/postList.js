import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import { Typography, Container } from '@material-ui/core'
import styled from "@emotion/styled";
import PostTag from "./postTag"

const PostContainer = styled(Container)`
 background-color: ${props => props.theme.palette.primary.light};
`

const postList = ({ props }) => {
  return (
    props.map(({ node }) => (
      <PostContainer key={node.id}>
        <Link to={node.fields.slug}>
          <Typography component="H2" variant="H3">{node.frontmatter.title}</Typography>
          {node.frontmatter.cover != null ? (
            <Img
              alt={`${node.frontmatter.title} cover image`}
              fluid={node.frontmatter.cover.childImageSharp.fluid}
            />
          ) : (
              <img src="/image/dummy.jpg" alt="no cover" />
            )}
        </Link>
        <p>{node.frontmatter.date}</p>
        <p>{node.excerpt}</p>
        {node.frontmatter.tags != null ? (
          <PostTag tags={node.frontmatter.tags} />
        ) : (
            "No Tags"
          )}
      </PostContainer>
    ))
  )
}

export default postList