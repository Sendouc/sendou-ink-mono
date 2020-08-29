import { BuildsAbilities, Ability } from "@sendou-ink/shared";
import AbilityIcon from "./AbilityIcon";
import { Flex, Box, BoxProps } from "@chakra-ui/core";

interface ViewSlotsProps {
  abilities: Partial<BuildsAbilities>;
  onAbilityClick?: (gear: "HEAD" | "CLOTHING" | "SHOES", index: number) => void;
}

const ViewSlots: React.FC<ViewSlotsProps & BoxProps> = ({
  abilities,
  onAbilityClick,
  ...props
}) => {
  return (
    <Box {...props}>
      <Flex alignItems="center" justifyContent="center">
        {(
          abilities.headgearAbilities ?? [
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
          ]
        ).map((ability, index) => (
          <Box
            mx="3px"
            key={index}
            onClick={
              onAbilityClick ? () => onAbilityClick("HEAD", index) : undefined
            }
            cursor={onAbilityClick ? "pointer" : undefined}
          >
            <AbilityIcon
              key={index}
              ability={ability}
              size={index === 0 ? "MAIN" : "SUB"}
            />
          </Box>
        ))}
      </Flex>
      <Flex alignItems="center" justifyContent="center" my="0.5em">
        {(
          abilities.clothingAbilities ?? [
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
          ]
        ).map((ability, index) => (
          <Box
            mx="3px"
            key={index}
            onClick={
              onAbilityClick
                ? () => onAbilityClick("CLOTHING", index)
                : undefined
            }
            cursor={onAbilityClick ? "pointer" : undefined}
          >
            <AbilityIcon
              key={index}
              ability={ability}
              size={index === 0 ? "MAIN" : "SUB"}
            />
          </Box>
        ))}
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        {(
          abilities.shoesAbilities ?? [
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
            "UNKNOWN",
          ]
        ).map((ability, index) => (
          <Box
            mx="3px"
            key={index}
            onClick={
              onAbilityClick ? () => onAbilityClick("SHOES", index) : undefined
            }
            cursor={onAbilityClick ? "pointer" : undefined}
          >
            <AbilityIcon
              key={index}
              ability={ability}
              size={index === 0 ? "MAIN" : "SUB"}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ViewSlots;
