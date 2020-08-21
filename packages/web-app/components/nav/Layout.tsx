import TopNav from "./TopNav";
import IconNavBar, { navIcons } from "./IconNavBar";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerBody,
  useDisclosure,
  IconButton,
  DrawerCloseButton,
  Image,
  Heading,
  Flex,
} from "@chakra-ui/core";
import useBgColor from "utils/useBgColor";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useBgColor();

  return (
    <>
      <TopNav />
      <IconNavBar />
      <Box p={4} maxW="75rem" mx="auto">
        {children}
      </Box>

      <IconButton
        aria-label="Open menu"
        onClick={onOpen}
        icon={<FiMenu />}
        position="fixed"
        bottom={0}
        right={0}
        isRound
        m={4}
        size="lg"
        display={["flex", null, "none"]}
      >
        Open
      </IconButton>
      <Drawer onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton />
          <DrawerBody>
            {navIcons.map(({ name, isDisabled, displayName }) => (
              <Link key={name} href={isDisabled ? "/" : "/" + name}>
                <Flex alignItems="center" my={4} onClick={onClose}>
                  <Image
                    src={`/images/navIcons/${name}.webp`}
                    fallbackSrc={`/images/navIcons/${name}.png`}
                    h={12}
                    w={12}
                    mx={4}
                    alt={name}
                    cursor={isDisabled ? undefined : "pointer"}
                    style={{
                      filter: isDisabled ? "grayscale(100%)" : undefined,
                    }}
                  />
                  <Heading size="md">{displayName}</Heading>
                </Flex>
              </Link>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Layout;
