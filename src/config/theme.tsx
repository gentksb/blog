import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 760, //custom
      md: 960,
      lg: 1280,
      xl: 1920,
    }
  }
});

export default theme;