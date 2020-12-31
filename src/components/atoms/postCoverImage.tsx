import { AspectRatio, Image } from "@chakra-ui/react"
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
    : (<AspectRatio ratio={16/9}>
      <Image src="/image/dummy.jpg" alt="cover image" objectFit="cover" />
    </AspectRatio>)
  )

  export default postCoverImage