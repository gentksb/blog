import { AspectRatio, Image } from "@chakra-ui/react"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

interface Props {
  alt: string
  image: IGatsbyImageData
}

const postCoverImage: React.FunctionComponent<Props> = ({ image, alt }) =>
  image != undefined ? (
    <GatsbyImage
      image={image}
      alt={alt}
      style={{ width: "100%" }}
      objectFit={"contain"}
    />
  ) : (
    <AspectRatio ratio={16 / 9}>
      <Image src="/image/dummy.jpg" alt="cover image" objectFit="cover" />
    </AspectRatio>
  )

export default postCoverImage
