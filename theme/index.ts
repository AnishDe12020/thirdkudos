import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  semanticTokens: {
    colors: {
      "brand.primary": {
        default: "#fafafa",
        _dark: "#0f0f0f",
      },
      "brand.secondary": {
        default: "#eeeeee",
        _dark: "#222222",
      },
      "brand.tertiary": {
        default: "#cecfd1",
        _dark: "#303030",
      },
      "brand.quaternary": {
        default: "#bdbdc2",
        _dark: "#474747",
      },
    },
  },
  styles: {
    global: {
      "html, body": {
        background: "brand.primary",
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
});

export default theme;
