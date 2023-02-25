import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Button, HStack } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"

interface Props {
  targetTag?: string
}

const TagList: React.FunctionComponent<Props> = ({ targetTag }) => {
  const data: Queries.TagListQuery =
    useStaticQuery<Queries.TagListQuery>(graphql`
      query TagList {
        allMdx(filter: { frontmatter: { draft: { eq: false } } }) {
          group(field: { frontmatter: { tags: SELECT } }) {
            fieldValue
            totalCount
          }
        }
      }
    `)

  const allTagAndCount = data.allMdx
  const tagArray = allTagAndCount.group.map((tagdata) => {
    const tag = tagdata.fieldValue
    const count = tagdata.totalCount
    const buttonColor = tag === targetTag ? "blue" : "gray"

    return (
      <Link
        to={`/tags/${tag.toLowerCase()}`}
        style={{ textDecoration: "none" }}
        key={tag}
      >
        <Button
          key={tag}
          leftIcon={<AttachmentIcon />}
          aria-label={`${tag}:${count}`}
          size="sm"
          variant="solid"
          colorScheme={buttonColor}
          mt={2}
        >
          {`${tag}:${count}`}
        </Button>
      </Link>
    )
  })

  return (
    <HStack maxW="100%" display="block" p={1}>
      {tagArray}
    </HStack>
  )
}

export default TagList
