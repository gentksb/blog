import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFE082",
      dark: "#F9A825",
      light: "#FFFDE7"
    },
    secondary: {
      main: "#FF5722"
    },
    text: {
      primary: "#6C5632",
      secondary: "#6C5632"
    }
  }
});

export default theme;