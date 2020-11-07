import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
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

theme = responsiveFontSizes(theme)

export default theme;