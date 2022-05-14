import React from "react"
import { Link } from "gatsby"
import { Grid, Button, GridItem, Text } from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"

interface Props {
  previous?: GatsbyTypes.MdxEdge["previous"]
  next?: GatsbyTypes.MdxEdge["next"]
}

const PrevAndNextPost: React.FunctionComponent<Props> = ({
  previous,
  next
}) => {
  const hasPreviousPost = !!previous
  const hasNextPost = !!next
  const previousPostPath = previous?.fields.slug
  const nextPostPath = next?.fields.slug
  const previousPageTitle = previous?.frontmatter.title
  const nextPageTitle = next?.frontmatter.title

  return (
    <Grid templateColumns="repeat(auto-fill, 50%)" w="100%">
      <GridItem colSpan={[2, 2, 1, 1]} margin={1}>
        <Link to={previousPostPath} rel="prev">
          <Button
            variant="outline"
            isDisabled={!hasPreviousPost}
            leftIcon={<ArrowBackIcon />}
            isFullWidth
          >
            <Text isTruncated>{previousPageTitle}</Text>
          </Button>
        </Link>
      </GridItem>
      <GridItem colSpan={[2, 2, 1, 1]} margin={1} textAlign="right">
        <Link to={nextPostPath} rel="next">
          <Button
            variant="outline"
            isDisabled={!hasNextPost}
            rightIcon={<ArrowForwardIcon />}
            isFullWidth
          >
            <Text isTruncated>{nextPageTitle}</Text>
          </Button>
        </Link>
      </GridItem>
    </Grid>
  )
}

export default PrevAndNextPost
