import { Ability } from "@sendou-ink/shared";
import { Image, ImageProps } from "@chakra-ui/core";

//https://github.com/loadout-ink/splat2-calc

const sizeMap = {
  MAIN: "50px",
  SUB: "40px",
  TINY: "30px",
  SUBTINY: "20px",
} as const;

interface AbilityIconProps {
  ability: Ability;
  size: "MAIN" | "SUB" | "TINY" | "SUBTINY";
}

const AbilityIcon: React.FC<AbilityIconProps> = ({ ability, size }) => (
  <picture
    style={{
      zIndex: 2,
      borderRadius: "50%",
      width: sizeMap[size],
      height: sizeMap[size],
      background: "#000",
      border: "2px solid #888",
      borderRight: "0px",
      borderBottom: "0px",
      backgroundSize: "100%",
      boxShadow: "0 0 0 1px #000",
      userSelect: "none",
      display: "inline-block",
    }}
  >
    {/*<source srcSet={`/images/abilityIcons/${ability}.webp`} type="image/webp" />*/}
    <source srcSet={`/images/abilityIcons/${ability}.png`} type="image/png" />
    <img srcSet={`/images/abilityIcons/${ability}.png`} />
  </picture>
);

export default AbilityIcon;
