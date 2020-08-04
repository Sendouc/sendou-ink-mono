import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";
import { mode, Styles } from "@chakra-ui/theme-tools";
import Layout from "components/nav/Layout";
import { AppProps } from "next/app";
import GoogleFonts from "next-google-fonts";

const styles: Styles = {
  ...theme.styles,
  global: (props) => ({
    ...theme.styles.global,
    //fontFamily: "body",
    color: mode("blackAlpha.900", "whiteAlpha.900")(props),
    bg: mode("gray.50", "#031e3e")(props),
  }),
};

const customTheme: any = {
  ...theme,
  /*fonts: {
    ...theme.fonts,
    body: `"Rubik",${theme.fonts.body}`,
    heading: `"Rubik",${theme.fonts.heading}`,
  },*/
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
      {/*<GoogleFonts href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap" />*/}
      <CSSReset />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
