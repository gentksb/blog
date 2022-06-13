import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Box, Heading, LinkBox, LinkOverlay, VStack } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"
interface Props {
  tag: string
  id: string
}

const RelatedPosts: React.FunctionComponent<Props> = ({ tag, id }) => {
  const recentPostsData: Queries.RecentPostQuery =
    useStaticQuery<Queries.RecentPostQuery>(graphql`
      query RecentPost {
        allMdx(limit: 10, sort: { fields: frontmatter___date, order: DESC }) {
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

  const relatedRecentPostsData = recentPostsData.allMdx.edges.filter(
    (edge) => edge.node.frontmatter.tags.includes(tag) === true
  )
  const excludeSelfPostData = relatedRecentPostsData.filter(
    (edge) => edge.node.id !== id
  )

  const relatedRecentPostsElements = excludeSelfPostData.map(({ node }) => {
    return (
      <LinkBox
        as="article"
        key={node.id}
        width="100%"
        p={[2, 2, 3, 3]}
        borderWidth="1px"
        rounded="md"
      >
        <Heading size="sm" fontWeight="normal">
          <LinkOverlay href={node.fields.slug}>
            {node.frontmatter.title}
          </LinkOverlay>
        </Heading>
      </LinkBox>
    )
  })
  return (
    <Box width="100%" p={1}>
      <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} my={2}>
        <AttachmentIcon color="teal.500" height="1lh" mr={2} />
        関連記事
      </Heading>
      <VStack spacing={2}>{relatedRecentPostsElements}</VStack>
    </Box>
  )
}

export default RelatedPosts
