import { AppProps } from "next/app";
import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import { mode, Styles } from "@chakra-ui/theme-tools";
import theme, { Theme } from "@chakra-ui/theme";
import Layout from "components/nav/Layout";

/*const myTheme = {
  ...theme,
  //https://github.com/chakra-ui/chakra-ui/issues/1278
  breakpoints: ["30em", "48em", "62em", "80em"],
  config: { useSystemColorMode: true, initialColorMode: "dark" },
  bg: {
    main: "#031e3e",
    secondary: "#0e2a56",
  },
  colors: {
    ...theme.colors,
    bg: {
      main: "#031e3e",
      secondary: "#0e2a56",
    },
  },
  styles: {
    global: (props: any) => ({
      ...theme.styles.global,
      "html, body": {
        backgroundColor: props.colorMode === "dark" ? "green" : "tomato",
      },
    }),
  },
};*/

const styles: Styles = {
  ...theme.styles,
  global: (props) => ({
    ...theme.styles.global,
    fontFamily: "body",
    color: mode("gray.100", "whiteAlpha.900")(props),
    bg: mode("#031e3e", "gray.900")(props),
  }),
};

const customTheme: any = {
  ...theme,
  //https://github.com/chakra-ui/chakra-ui/issues/1278
  breakpoints: ["30em", "48em", "62em", "80em"] as any,
  fonts: {
    ...theme.fonts,
    body: `"Source Sans Pro",${theme.fonts.body}`,
    heading: `"Source Sans Pro",${theme.fonts.heading}`,
  },
  colors: {
    ...theme.colors,
    bg: {
      secondary: "#0e2a56",
    },
  },
  config: {
    ...theme.config,
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
  styles,
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
