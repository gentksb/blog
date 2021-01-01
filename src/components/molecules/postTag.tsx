import React from "react"
import { Link } from "gatsby"
import { HStack, Tag } from "@chakra-ui/react"
interface Props {
  tags?: string[]
}

const PostTag: React.FunctionComponent<Props> = ({ tags }) => {

  const tagArray = (tags != null) ?
    (
      tags.map((tag) => (
        <Link to={`/tags/${tag.toLowerCase()}`} style={{ textDecoration: 'none' }} key={tag}>
          <Tag key={tag} size="sm" variant="solid">
              {tag}
          </Tag>
        </Link>
      ))
    ) : (
      <Tag size="sm" variant="solid">
        No tags
      </Tag>
    )

  return (
    <HStack spacing={2} padding="0.25rem 0 0.25rem 0">
      {tagArray}
    </HStack>
  )
}

export default PostTag