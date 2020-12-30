import { CardMedia } from "@material-ui/core"
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
    : (<CardMedia image="/image/dummy.jpg" title={alt} style={{ paddingTop: '56.25%' }} />)
  )

  export default postCoverImage