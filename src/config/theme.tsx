import { extendTheme } from "@chakra-ui/react"
import BlogPostStyle from "../styles/blog-post.style"

const theme = extendTheme({
  styles: {
    global: {
      ".post-body": {
        ...BlogPostStyle
      }
    }
  }
});

export default theme;