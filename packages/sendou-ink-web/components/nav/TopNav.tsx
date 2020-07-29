import React from "react";
import { Box, Flex, Image } from "@chakra-ui/core";
import ColorModeToggle from "./ColorModeToggle";

const TopNav = () => {
  return (
    <Flex
      bg="bg.main"
      w="100%"
      alignItems="center"
      justifyContent="space-between"
      p={1}
    >
      <ColorModeToggle />
      <Box color="gray.600" fontWeight="bold" letterSpacing={1}>
        sendou.ink
      </Box>
      <Image
        src="https://pbs.twimg.com/profile_images/1274370738452135940/M0omX7PM_400x400.png"
        borderRadius="50%"
        w={6}
        h={6}
        mr={2}
      />
    </Flex>
  );
};

export default TopNav;
