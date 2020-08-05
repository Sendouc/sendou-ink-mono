import { useColorModeValue } from "@chakra-ui/core";

const useBgColor = (): "blue.100" | "#0e2a56" =>
  useColorModeValue("blue.100", "#0e2a56");

export default useBgColor;
