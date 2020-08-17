import { Box, Flex, Image, Avatar } from "@chakra-ui/core";
import ColorModeToggle from "./ColorModeToggle";
import { signIn } from "next-auth/client";
import MyButton from "components/common/MyButton";
import useUser from "utils/useUser";
import Link from "next/link";
import DiscordIcon from "icons/discord";

const TopNav = () => {
  const [user, loading] = useUser();

  const UserItem = () => {
    if (loading) return <Box />;
    if (!user)
      return (
        <MyButton
          onClick={() => signIn("discord")}
          leftIcon={<DiscordIcon />}
          variant="ghost"
          size="sm"
        >
          Login via Discord
        </MyButton>
      );

    return (
      <Link href={`/u/${user.discord.id}`}>
        <Avatar src={user.discord.avatarUrl} size="sm" m={1} cursor="pointer" />
      </Link>
    );
  };

  return (
    <Flex w="100%" alignItems="center" justifyContent="space-between" p={1}>
      <ColorModeToggle />
      <Box color="gray.600" fontWeight="bold" letterSpacing={1}>
        sendou.ink
      </Box>
      <UserItem />
    </Flex>
  );
};

export default TopNav;
