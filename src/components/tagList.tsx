import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Chip, Container } from "@material-ui/core"
import { LocalOffer } from "@material-ui/icons"
import styled from "@emotion/styled"

const TagChip = styled(Chip)`
  margin: 8px 8px;
`
const TagContainer = styled(Container)`
  padding: 0;
  margin: 8px auto;
`

const TagList = ({ targetTag }) => {
  const data = useStaticQuery(graphql`
    query TagList {
      allMarkdownRemark(filter: { frontmatter: { draft: { eq: false } } }) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  const allTagAndCount = data.allMarkdownRemark
  const tagArray = allTagAndCount.group.map((tagdata) => {
    const tag = tagdata.fieldValue
    const count = tagdata.totalCount
    const isEnabledTag = tag === targetTag ? "primary" : "default"

    return (
      <Link
        to={`/tags/${tag.toLowerCase()}`}
        style={{ textDecoration: "none" }}
        key={tag}
      >
        <TagChip
          key={tag}
          label={`${tag}:${count}`}
          color={isEnabledTag}
          size="medium"
          variant="outlined"
          icon={<LocalOffer />}
          clickable
          style={{ textDecoration: `none` }}
        />
      </Link>
    )
  })

  return <TagContainer>{tagArray}</TagContainer>
}

export default TagList
