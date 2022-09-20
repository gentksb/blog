import { extendTheme } from "@chakra-ui/react"

const primaryColor = "blue.500"
const secondaryColor = "teal.200"

const theme = extendTheme({
  layerStyles: {
    themeBgColor: {
      bg: primaryColor
    }
  },
  styles: {
    global: {
      ".post-body": {
        // h3: {
        //   marginTop: "0.25rem",
        //   marginBottom: "0.25rem",
        //   padding: "0.25em 0 0.25em 0.75em",
        //   borderLeftWidth: "6px",
        //   borderLeftStyle: "solid",
        //   borderLeftColor: primaryColor,
        //   borderBottomColor: primaryColor,
        //   borderBottomStyle: "solid",
        //   borderBottomWidth: "1px",
        //   fontWeight: "bold",
        //   fontSize: "lg"
        // },
        h4: {
          fontWeight: "bold",
          fontSize: "lg"
        },
        /* Quote */
        blockquote: {
          position: "relative",
          padding: "8px 16px",
          background: "#f5f5f5",
          color: "#555",
          borderLeft: `4px solid ${secondaryColor}`,
          width: "90%",
          margin: "16px auto"
        },
        "blockquote:before": {
          display: "inline-block",
          position: "absolute",
          top: "16px",
          left: "16px",
          verticalAlign: "middle",
          color: secondaryColor,
          fontSize: "25px",
          lineHeight: "1"
        },
        "blockquote p": {
          padding: "0",
          margin: "16px 0 8px",
          fontSize: "15px",
          lineHeight: "1.5"
        }
      }
    }
  }
})

export default theme
