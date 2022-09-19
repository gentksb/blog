import { Link } from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
  href: string
}

export const MdxLink: React.FC<Props> = ({ children, href }) => {
  const isExternal = !href.startsWith("https://blog.gensobunya.net/")
  return (
    <Link
      color="teal.500"
      href={href}
      _hover={{ textDecoration: "underline" }}
      isExternal={isExternal}
    >
      {children}
    </Link>
  )
}
