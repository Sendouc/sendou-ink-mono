import { IconButton, useColorMode } from "@chakra-ui/core";
import { FiSun, FiMoon } from "react-icons/fi";

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
      variant="ghost"
      color="current"
      fontSize="20px"
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <FiSun /> : <FiMoon />}
      borderRadius="50%"
    />
  );
};

export default ColorModeToggle;
