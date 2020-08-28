import { Box, Switch, FormLabel, Flex } from "@chakra-ui/core";
import AbilityIcon from "components/builds/AbilityIcon";
import useColors from "utils/useColors";

interface HeadOnlyToggleProps {
  ability: "OG" | "CB";
  active: boolean;
  setActive: () => void;
  isOther?: boolean;
}

const HeadOnlyToggle: React.FC<HeadOnlyToggleProps> = ({
  ability,
  active,
  setActive,
  isOther,
}) => {
  const {
    accent,
    secondaryAccent,
    colorScheme,
    secondaryColorScheme,
  } = useColors();
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      mb="1em"
    >
      <Box>
        <Switch
          id="show-all"
          colorScheme={isOther ? secondaryColorScheme : colorScheme}
          isChecked={active}
          onChange={() => setActive()}
          mr="0.5em"
        />
        <FormLabel htmlFor="show-all" mt={2}>
          <AbilityIcon ability={ability} size="TINY" />
        </FormLabel>
      </Box>
      {active && ability === "OG" && (
        <Box color={isOther ? secondaryAccent : accent} fontWeight="bold">
          +15AP{" "}
          {["SSU", "RSU", "RES"].map((ability) => (
            <Box as="span" mx="0.2em" key={ability}>
              <AbilityIcon ability={ability as any} size="SUBTINY" />
            </Box>
          ))}
        </Box>
      )}
      {active && ability === "CB" && (
        <Box color={isOther ? secondaryAccent : accent} fontWeight="bold">
          +10AP{" "}
          {["ISM", "ISS", "REC", "RSU", "SSU", "SCU"].map((ability) => (
            <Box as="span" mx="0.2em" key={ability}>
              <AbilityIcon ability={ability as any} size="SUBTINY" />
            </Box>
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default HeadOnlyToggle;
