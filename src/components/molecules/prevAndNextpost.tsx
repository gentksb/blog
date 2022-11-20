import React from "react"
import { Link } from "gatsby"
import { Grid, Button, GridItem, Text } from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"

interface Props {
  previous?: Queries.MdxEdge["previous"]
  next?: Queries.MdxEdge["next"]
}

const PrevAndNextPost: React.FunctionComponent<Props> = ({
  previous,
  next
}) => {
  const hasPreviousPost = !!previous
  const hasNextPost = !!next
  const previousPostPath = previous?.fields?.slug
  const nextPostPath = next?.fields?.slug
  const previousPageTitle = previous?.frontmatter?.title
  const nextPageTitle = next?.frontmatter?.title

  //graphqlで取得するnextは過去の記事(index+1)を指している

  return (
    <Grid templateColumns="repeat(auto-fill, 50%)" w="100%">
      <GridItem colSpan={[2, 2, 1, 1]} margin={1}>
        <Link to={nextPostPath} rel="past">
          <Button
            variant="outline"
            isDisabled={!hasNextPost}
            leftIcon={<ArrowBackIcon />}
            width="full"
          >
            <Text noOfLines={1}>{nextPageTitle}</Text>
          </Button>
        </Link>
      </GridItem>
      <GridItem colSpan={[2, 2, 1, 1]} margin={1} textAlign="right">
        <Link to={previousPostPath} rel="future">
          <Button
            variant="outline"
            isDisabled={!hasPreviousPost}
            rightIcon={<ArrowForwardIcon />}
            width="full"
          >
            <Text noOfLines={1}>{previousPageTitle}</Text>
          </Button>
        </Link>
      </GridItem>
    </Grid>
  )
}

export default PrevAndNextPost
