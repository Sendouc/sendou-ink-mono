import React from "react";
import { Box, Flex, Image } from "@chakra-ui/core";
import ColorModeToggle from "./ColorModeToggle";

const TopNav = () => {
  return (
    <Flex w="100%" alignItems="center" justifyContent="space-between" p={1}>
      <ColorModeToggle />
      <Box color="gray.600" fontWeight="bold" letterSpacing={1}>
        sendou.ink
      </Box>
      <Box />
    </Flex>
  );
};

export default TopNav;
