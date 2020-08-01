import React from "react";
import { Flex, Image } from "@chakra-ui/core";
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
        <Image
          key={name}
          src={`/images/navIcons/${name}.webp`}
          fallbackSrc={`/images/navIcons/${name}.png`}
          h={12}
          w={12}
          mx={2}
          alt={name}
        />
      ))}
    </Flex>
  );
};

export default IconNavBar;
