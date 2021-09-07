import React from "react"
import { Link } from "gatsby"
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react"
import { CalendarIcon } from "@chakra-ui/icons"
import moment from "moment"
import PostTag from "../molecules/postTag"
import PostCoverImage from "../atoms/postCoverImage"
import { convertMdxDateToIsoJstDate } from "../../utils/convertMdxDateToIsoJstDate"

interface Props {
  edges: GatsbyTypes.IndexPageQuery["allMdx"]["edges"]
}

const postList: React.FunctionComponent<Props> = ({ edges }) => {
  const postCards = edges.map(({ node }, index) => {
    const coverTitleText = `${node.frontmatter.title} cover image`
    const columnSpan = index === 0 ? 2 : 1
    const nodeIsoDate = convertMdxDateToIsoJstDate(node.frontmatter.date)
    const formattedDate = moment(nodeIsoDate).format("YYYY-MM-DD")

    return (
      <GridItem colSpan={columnSpan} key={node.id}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" h="100%">
          <Link to={node.fields.slug} style={{ textDecoration: "none" }}>
            <PostCoverImage
              image={node.frontmatter.cover?.childImageSharp?.gatsbyImageData}
              alt={coverTitleText}
            />
          </Link>
          <VStack spacing={1} padding={1} alignItems="left">
            <Link to={node.fields.slug} style={{ textDecoration: "none" }}>
              <Heading as="h2" fontSize={{ base: "md", md: "xl" }}>
                {node.frontmatter.title}
              </Heading>
              <HStack fontSize={{ base: "sm", md: "md" }}>
                <CalendarIcon />
                <Text color="gray.500">{formattedDate}</Text>
              </HStack>
            </Link>
            <PostTag tags={node.frontmatter.tags} />
          </VStack>
        </Box>
      </GridItem>
    )
  })
  return (
    <Grid templateColumns="repeat(2,1fr)" gap={2}>
      {postCards}
    </Grid>
  )
}

export default postList
