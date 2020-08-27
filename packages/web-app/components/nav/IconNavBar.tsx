import { Flex, Image } from "@chakra-ui/core";
import Link from "next/link";
import useColors from "utils/useColors";

export const navIcons = [
  { name: "builds", isDisabled: true, displayName: "Builds" },
  { name: "analyzer", isDisabled: false, displayName: "Build Analyzer" },
  { name: "calendar", isDisabled: true, displayName: "Calendar" },
  { name: "freeagents", isDisabled: true, displayName: "Free Agents" },
  { name: "teams", isDisabled: true, displayName: "Teams" },
  { name: "plans", isDisabled: false, displayName: "Map Planner" },
  { name: "tournaments", isDisabled: true, displayName: "Tournaments" },
  { name: "xsearch", isDisabled: true, displayName: "Top 500" },
] as const;

const IconNavBar = () => {
  const { navBg } = useColors();
  return (
    <Flex
      bg={navBg}
      justifyContent="center"
      py={2}
      display={["none", null, "flex"]}
    >
      {navIcons.map(({ name, isDisabled }) => {
        return (
          <Link key={name} href={isDisabled ? "/" : "/" + name}>
            <Image
              src={`/images/navIcons/${name}.webp`}
              fallbackSrc={`/images/navIcons/${name}.png`}
              h={12}
              w={12}
              mx={2}
              alt={name}
              cursor={isDisabled ? undefined : "pointer"}
              style={{
                filter: isDisabled ? "grayscale(100%)" : undefined,
              }}
            />
          </Link>
        );
      })}
    </Flex>
  );
};

export default IconNavBar;
