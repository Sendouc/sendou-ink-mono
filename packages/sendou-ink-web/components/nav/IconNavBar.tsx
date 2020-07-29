import React from "react";
import { Flex, Image } from "@chakra-ui/core";

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
  return (
    <Flex bg="bg.secondary" justifyContent="center" py={2}>
      {icons.map(({ name }) => (
        <Image
          key={name}
          src={`/images/${name}.webp`}
          fallbackSrc={`/images/${name}.png`}
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
