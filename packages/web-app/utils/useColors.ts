import { useColorModeValue } from "@chakra-ui/core";

interface Theme {
  bg: string;
  navBg: string;
  colorScheme: string;
  secondaryColorScheme: string;
  accent: string;
  secondaryAccent: string;
  secondaryText: string;
  boxShadow: string;
}

const useColors = (): Theme =>
  useColorModeValue(
    // light
    {
      bg: "whiteAlpha.900",
      navBg: "blue.100",
      colorScheme: "blue",
      secondaryColorScheme: "orange",
      accent: "blue.600",
      secondaryAccent: "orange.600",
      secondaryText: "gray.500",
      boxShadow: "0px 0px 16px 6px rgba(0,0,0,0.1)",
    },
    // dark
    {
      bg: "#0e2a56",
      navBg: "#0e2a56",
      colorScheme: "blue",
      secondaryColorScheme: "orange",
      accent: "blue.200",
      secondaryAccent: "orange.200",
      secondaryText: "gray.400",
      boxShadow: "0px 0px 16px 6px rgba(0,0,0,0.1)",
    }
  );

export default useColors;
