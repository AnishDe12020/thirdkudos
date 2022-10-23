import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        background: "#111111",
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
});

export default theme;
