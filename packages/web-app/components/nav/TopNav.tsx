import { Box, Flex, Image } from "@chakra-ui/core";
import ColorModeToggle from "./ColorModeToggle";
import { signIn, signOut, useSession } from "next-auth/client";
import MyButton from "components/common/MyButton";

const TopNav = () => {
  return (
    <Flex w="100%" alignItems="center" justifyContent="space-between" p={1}>
      <ColorModeToggle />
      <Box color="gray.600" fontWeight="bold" letterSpacing={1}>
        sendou.ink
      </Box>
      <MyButton onClick={signIn}>Login</MyButton>
    </Flex>
  );
};

export default TopNav;
