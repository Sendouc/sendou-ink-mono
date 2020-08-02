import React from "react";
import { Flex, Image, Link } from "@chakra-ui/core";
import useBgColor from "utils/useBgColor";

const icons = [
  { name: "builds" },
  { name: "analyzer" },
  { name: "calendar" },
  { name: "freeagents" },
  { name: "teams" },
  { name: "plans" },
  { name: "tournaments" },
  { name: "xsearch" },
] as const;

const IconNavBar = () => {
  const bg = useBgColor();
  return (
    <Flex bg={bg} justifyContent="center" py={2}>
      {icons.map(({ name }) => (
        <Link key={name} href={"/" + name}>
        <Image
          src={`/images/navIcons/${name}.webp`}
          fallbackSrc={`/images/navIcons/${name}.png`}
          h={12}
          w={12}
          mx={2}
          alt={name}
        />
        </Link>
      ))}
    </Flex>
  );
};

export default IconNavBar;
