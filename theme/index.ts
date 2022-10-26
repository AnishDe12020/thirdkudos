import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      "html, body": {
        background: mode("#f0f0f0", "#111111")(props),
      },
    }),
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
});

export default theme;
