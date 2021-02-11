import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Box, Heading, LinkBox, LinkOverlay, VStack } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"
interface Props {
  tag: string
}

const relatedPosts: React.FunctionComponent<Props> = ({tag}) =>{
  const recentPostsData: GatsbyTypes.RecentPostQuery = useStaticQuery<GatsbyTypes.RecentPostQuery>(graphql`
    query RecentPost {
      allMdx(limit: 5, sort: {fields: frontmatter___date, order: DESC}) {
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

  const relatedRecentPostsData = recentPostsData.allMdx.edges.filter( edge => edge.node.frontmatter.tags.includes(tag) === true)

  const relatedRecentPostsElements = (
    relatedRecentPostsData.map( ({node})  => {
      return (
        <LinkBox as="article" key={node.id} width="100%" p={[2,2,3,3]}  borderWidth="1px" rounded="md"> 
          <Heading size="md" fontWeight="normal">
            <LinkOverlay href="#">{node.frontmatter.title}</LinkOverlay>
          </Heading> 
        </LinkBox>
      )
    })
  )
  return (
    <Box width="100%">
      <Heading as="h2" fontSize={{ base: "xl", md: "2xl"}} my={2}><AttachmentIcon color="teal.500" height="1lh" mr={2} />関連記事</Heading>
      <VStack spacing={2} >
      {relatedRecentPostsElements}
      </VStack>
    </Box>
  )
  }


export default relatedPosts