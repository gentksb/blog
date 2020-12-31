import { Box } from "@chakra-ui/react"
import Img, { FluidObject } from "gatsby-image"
// import { ImageSharpFluid, IndexPageQuery } from "../../../types/graphql-types"

interface Props {
  cover: any //coverの型を上手く指定できないため
  alt: string
  fluid?: FluidObject | null
}

  const postCoverImage: React.FunctionComponent<Props> = ({cover, alt, fluid}) => (
    cover != null 
    ? (<Img fluid={fluid} title={alt} />) 
    : (<Box pt="56.25%" bgImage="url('/image/dummy.jpg')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" />) //16:9 image = 56.25%
  )

  export default postCoverImage