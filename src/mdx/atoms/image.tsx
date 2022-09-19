import { Image } from "@chakra-ui/react"
import React from "react"

export const MdxImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props
) => {
  return (
    <Image {...props} objectFit="contain" maxHeight="760px" marginBottom={8} />
  )
}
