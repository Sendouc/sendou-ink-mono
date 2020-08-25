import { stackableAbilities, mainOnlyAbilities } from "@sendou-ink/shared";
import AbilityIcon from "../builds/AbilityIcon";
import { Ability } from "@sendou-ink/shared";
import { Box, Flex } from "@chakra-ui/core";

interface AbilityButtonsProps {
  onClick: (ability: Ability) => void;
}

const AbilityButtons: React.FC<AbilityButtonsProps> = ({ onClick }) => {
  return (
    <>
      <Box my="1em" textAlign="center">
        Main only abilities (click to select)
      </Box>
      <Flex flexWrap="wrap" justifyContent="center" maxW="340px" mx="auto">
        {mainOnlyAbilities.map((ability) => (
          <Box
            m="0.3em"
            key={ability}
            cursor="pointer"
            onClick={() => onClick(ability)}
          >
            <AbilityIcon ability={ability} size="SUB" />
          </Box>
        ))}
      </Flex>
      <Box my="1em" textAlign="center">
        <Box>Stackable abilities</Box>
      </Box>
      <Flex flexWrap="wrap" justifyContent="center" maxW="350px" mx="auto">
        {stackableAbilities.map((ability) =>
          ability === "UNKNOWN" ? null : (
            <Box
              m="0.3em"
              key={ability}
              cursor="pointer"
              onClick={() => onClick(ability)}
            >
              <AbilityIcon ability={ability} size="SUB" />
            </Box>
          )
        )}
      </Flex>
    </>
  );
};

export default AbilityButtons;
