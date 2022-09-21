import { Image, Text } from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface CaptionProps {
  attributes: React.HTMLAttributes<HTMLElement>
  children: ReactNode
  className: string
}

export const MdxImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
  props
) => <Image {...props} objectFit="contain" maxHeight="760px" marginBottom={8} />

export const MdxCaption: React.FC<CaptionProps> = ({
  attributes,
  children,
  className
}) => (
  <Text
    as="figcaption"
    fontSize="sm"
    color="gray.500"
    textAlign="center"
    {...attributes}
    className={className}
  >
    {children}
  </Text>
)
