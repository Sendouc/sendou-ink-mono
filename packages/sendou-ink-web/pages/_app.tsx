import { AppProps } from "next/app";
import { ChakraProvider, CSSReset, chakra } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";

const myTheme = { ...theme, config: { useSystemColorMode: true } };

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={myTheme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
