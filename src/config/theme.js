import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#784024",
      dark: "#2B0E00",
      light: "#C44100",
    },
    secondary: {
      main: "#00786F",
      dark: "#003833",
      light: "#00C4B4",
    },
    background: {
      default: "#424242",
    }
  }
});

export default theme;