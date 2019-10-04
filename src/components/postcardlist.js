import React from "react"
import { Link } from "gatsby"
import Thumbnail from "../components/thumbnail"
import styled from "styled-components"

const PostCardList = ({ nodes }) => {
  return nodes.map(({ node }) => {
    const title = node.frontmatter.title || node.fields.slug

    return (
      <ArticleContainer>
        <article key={node.fields.slug}>
          <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
            <HeaderBox>
              <TitleBox>
                <PostTitle>{title}</PostTitle>
              </TitleBox>
              <DateBox>
                <small>{node.frontmatter.date}</small>
              </DateBox>
              <ThumbnailBox>
                <Thumbnail
                  filename={node.frontmatter.featuredImage.base}
                  alt=""
                />
              </ThumbnailBox>
            </HeaderBox>
            <SectionBox>
              <section>
                <PostDescription
                  dangerouslySetInnerHTML={{
                    __html: node.excerpt,
                  }}
                />
                (続きを読む)
              </section>
            </SectionBox>
          </Link>
        </article>
      </ArticleContainer>
    )
  })
}

const ArticleContainer = styled.div`
padding:0px;
`
const HeaderBox = styled.header`
padding:0px
`
const TitleBox = styled.div``

const DateBox = styled.div`
  margin: 0;
  text-align: right;
`
const ThumbnailBox = styled.div``
const SectionBox = styled.div``
const PostDescription = styled.p`
  text-decoration: none;
  color: #000000;
`
const PostTitle = styled.h3`
  margin-bottom: 0.5em;
`
export default PostCardList
