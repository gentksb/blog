import React from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
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
              <PostTitle>{title}</PostTitle>
              <DateBox>
                <small>{node.frontmatter.date}</small>
              </DateBox>
              <ThumbnailWrapper>
                <Thumbnail
                  filename={node.frontmatter.featuredImage.base}
                  alt=""
                />
              </ThumbnailWrapper>
            </HeaderBox>
            <SectionWrapper>
              <section>
                <PostDescription
                  dangerouslySetInnerHTML={{
                    __html: node.excerpt,
                  }}
                />
                (続きを読む)
              </section>
            </SectionWrapper>
          </Link>
        </article>
      </ArticleContainer>
    )
  })
}

const ArticleContainer = styled.div``
const HeaderBox = styled.header``
const PostTitle = styled.h3`
  marginbottom: ${rhythm(1 / 4)};
`
const DateBox = styled.div`
  margin: 0;
  text-align: right;
`
const ThumbnailWrapper = styled.div``
const SectionWrapper = styled.div``
const PostDescription = styled.p`
  text-decoration: none;
  color: #000000;
`
export default PostCardList
