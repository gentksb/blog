import { ListItem, OrderedList, UnorderedList } from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const paddingLeft = 8
const paddingBottom = 4

export const MdxListUl: React.FC<Props> = ({ children }) => (
  <UnorderedList pl={paddingLeft} pb={paddingBottom}>
    {children}
  </UnorderedList>
)

export const MdxListOl: React.FC<Props> = ({ children }) => (
  <OrderedList pl={paddingLeft} pb={paddingBottom}>
    {children}
  </OrderedList>
)

export const MdxListLi: React.FC<Props> = ({ children }) => (
  <ListItem>{children}</ListItem>
)
