import React from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import Thumbnail from "../components/thumbnail"
import styled from "styled-components"

const ThumbnailBox = styled.div`
`
class PostCardList extends React.Component {
  render(){
    const {nodes} = this.props
  
    return (
      nodes.map(({ node }) => {
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
              <Thumbnail filename={node.frontmatter.featuredImage.base} alt=""/>
            </ThumbnailBox>
          </article>
          )
        }
      )
    )
  }
}

export default PostCardList