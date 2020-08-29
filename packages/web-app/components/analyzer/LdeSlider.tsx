import {
  Flex,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/core";
import AbilityIcon from "components/builds/AbilityIcon";
import useColors from "utils/useColors";

interface LdeSliderProps {
  value: number;
  setValue: (value: number) => void;
}

const LdeSlider: React.FC<LdeSliderProps> = ({ value, setValue }) => {
  const { colorScheme, accent } = useColors();
  const bonusAp = Math.floor((24 / 21) * value);

  const getLdeEffect = () => {
    if (value === 21)
      return "Enemy has reached the 30 point mark OR there is 30 seconds or less on the clock OR it is overtime";

    const pointMark = 51 - value;
    if (value > 0) return <>Enemy has reached the {pointMark} point mark</>;
    return "Enemy has not reached the 50 point mark or there is more than 30 seconds on the clock";
  };
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      mb="1em"
    >
      <Slider
        value={value}
        onChange={(value: number) => setValue(value)}
        max={21}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb size={6}>
          <Box minW="30px">
            <AbilityIcon ability="LDE" size="TINY" />
          </Box>
        </SliderThumb>
      </Slider>
      {value > 0 && (
        <Box color={accent} fontWeight="bold" mt="1em">
          +{bonusAp}
          AP{" "}
          {["ISM", "ISS", "REC"].map((ability) => (
            <Box as="span" mx="0.2em" key={ability}>
              <AbilityIcon ability={ability as any} size="SUBTINY" />
            </Box>
          ))}
        </Box>
      )}
      <Box
        color="gray.500"
        fontSize="0.75em"
        maxW="200px"
        mt="1em"
        textAlign="center"
      >
        {getLdeEffect()}
      </Box>
    </Flex>
  );
};

export default LdeSlider;
