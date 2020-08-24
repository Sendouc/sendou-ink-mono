import { Ability, AbilityOrUnknown } from "@sendou-ink/shared";
import { Image, ImageProps } from "@chakra-ui/core";

//https://github.com/loadout-ink/splat2-calc

const sizeMap = {
  MAIN: "50px",
  SUB: "40px",
  TINY: "30px",
  SUBTINY: "20px",
} as const;

interface AbilityIconProps {
  ability: AbilityOrUnknown<Ability>;
  size: "MAIN" | "SUB" | "TINY" | "SUBTINY";
}

const AbilityIcon: React.FC<AbilityIconProps> = ({ ability, size }) => {
  return (
    <Image
      src={`/images/abilityIcons/${ability}.png`}
      //fallbackSrc={`/images/abilityIcons/${ability}.webp`}
      alt={ability}
      zIndex={2}
      borderRadius="50%"
      width={sizeMap[size]}
      height={sizeMap[size]}
      background="#000"
      border="2px solid #888"
      borderRight="0px"
      borderBottom="0px"
      backgroundSize="100%"
      boxShadow="0 0 0 1px #000"
      userSelect="none"
      display="inline-block"
    />
  );
};

export default AbilityIcon;
