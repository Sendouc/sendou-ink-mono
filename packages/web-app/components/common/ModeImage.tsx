import React from "react";
import { Image, ImageProps } from "@chakra-ui/core";
import { RankedMode } from "@sendou-ink/shared/types";

interface ModeImageProps {
  mode: RankedMode;
}

const ModeImage: React.FC<ModeImageProps & ImageProps> = ({
  mode,
  ...props
}) => {
  return (
    <Image
      src={`/images/modeIcons/${mode}.webp`}
      fallbackSrc={`/images/modeIcons/${mode}.png`}
      {...props}
    />
  );
};

export default ModeImage;
