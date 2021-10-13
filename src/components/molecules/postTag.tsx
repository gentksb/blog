import React from "react"
import { Link } from "gatsby"
import { HStack, Tag, Box } from "@chakra-ui/react"
interface Props {
  tags?: readonly string[]
}

const PostTag: React.FunctionComponent<Props> = ({ tags }) => {
  const tagArray =
    tags != null ? (
      tags.map((tag) => (
        <Box>
          <Link
            to={`/tags/${tag.toLowerCase()}`}
            style={{ textDecoration: "none" }}
            key={tag}
          >
            <Tag size="sm" variant="solid">
              {tag}
            </Tag>
          </Link>
        </Box>
      ))
    ) : (
      <Tag size="sm" variant="solid">
        No tags
      </Tag>
    )

  return (
    <HStack spacing={2} padding="0.25rem 0 0.25rem 0" wrap="wrap">
      {tagArray}
    </HStack>
  )
}

export default PostTag
