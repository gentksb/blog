import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#e64946",
      dark: "#B33836",
      light: "#EA8E8C",
    },
    secondary: {
      main: "#0F993B",
      light: "#45E678",
      dark: "#0A6627",
    },
    text: {
      primary: "#262626",
      secondary: "#C3D0D9",
      white: "#ffffff"
    },
  }
});

export default theme;