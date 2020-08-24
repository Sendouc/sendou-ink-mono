import { Box, Switch, FormLabel, Flex } from "@chakra-ui/core";
import AbilityIcon from "components/builds/AbilityIcon";

interface HeadOnlyToggleProps {
  ability: "OG" | "CB";
  active: boolean;
  setActive: () => void;
}

const HeadOnlyToggle: React.FC<HeadOnlyToggleProps> = ({
  ability,
  active,
  setActive,
}) => {
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
          color="blue"
          isChecked={active}
          onChange={() => setActive()}
          mr="0.5em"
        />
        <FormLabel htmlFor="show-all">
          <AbilityIcon ability={ability} size="TINY" />
        </FormLabel>
      </Box>
      {active && ability === "OG" && (
        <Box color="blue.500" fontWeight="bold" mt="1em">
          +15AP{" "}
          {["SSU", "RSU", "RES"].map((ability) => (
            <Box as="span" mx="0.2em" key={ability}>
              <AbilityIcon ability={ability as any} size="SUBTINY" />
            </Box>
          ))}
        </Box>
      )}
      {active && ability === "CB" && (
        <Box color="blue.500" fontWeight="bold" mt="1em">
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
