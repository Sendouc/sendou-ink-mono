import { stages } from "@sendou-ink/shared/constants/stages";
import { PlannerMapBg } from "pages/plans";
import ModeImage from "components/common/ModeImage";
import { HStack, Image, Box } from "@chakra-ui/core";
import { RankedMode } from "@sendou-ink/shared";
import salmonRunHighTide from "icons/SalmonRunHighTide.svg";
import salmonRunMidTide from "icons/SalmonRunMidTide.svg";
import salmonRunLowTide from "icons/SalmonRunLowTide.svg";
import { MySelect } from "components/common/MySelect";

interface StageSelectorProps {
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  currentBackground: PlannerMapBg;
  changeMode: (mode: RankedMode) => void;
  changeTide: (tide: "low" | "mid" | "high") => void;
}

const StageSelector: React.FC<StageSelectorProps> = ({
  handleChange,
  currentBackground,
  changeMode,
  changeTide,
}) => {
  return (
    <Box maxW="20rem" m="3rem auto">
      <MySelect value={currentBackground.stage} onChange={handleChange}>
        {stages.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
        <option value="Spawning Grounds">Spawning Grounds</option>
        <option value="Marooner's Bay">Marooner's Bay</option>
        <option value="Lost Outpost">Lost Outpost</option>
        <option value="Salmonid Smokeyard">Salmonid Smokeyard</option>
        <option value="Ruins of Ark Polaris">Ruins of Ark Polaris‎‎</option>
      </MySelect>
      {currentBackground.tide ? (
        <>
          <HStack my={2} display="flex" justifyContent="center">
            <Image
              w={8}
              h={8}
              src={salmonRunLowTide}
              cursor="pointer"
              style={{
                filter:
                  currentBackground.tide === "low"
                    ? undefined
                    : "grayscale(100%)",
              }}
              onClick={() => changeTide("low")}
            />
            <Image
              w={8}
              h={8}
              src={salmonRunMidTide}
              cursor="pointer"
              style={{
                filter:
                  currentBackground.tide === "mid"
                    ? undefined
                    : "grayscale(100%)",
              }}
              onClick={() => changeTide("mid")}
            />
            <Image
              w={8}
              h={8}
              src={salmonRunHighTide}
              cursor="pointer"
              style={{
                filter:
                  currentBackground.tide === "high"
                    ? undefined
                    : "grayscale(100%)",
              }}
              onClick={() => changeTide("high")}
            />
          </HStack>
        </>
      ) : (
        <HStack my={2} display="flex" justifyContent="center">
          {(["SZ", "TC", "RM", "CB"] as RankedMode[]).map((mode) => (
            <ModeImage
              key={mode}
              onClick={() => changeMode(mode)}
              mode={mode}
              w={8}
              h={8}
              cursor="pointer"
              style={{
                filter:
                  currentBackground.mode === mode
                    ? undefined
                    : "grayscale(100%)",
              }}
            />
          ))}
        </HStack>
      )}
    </Box>
  );
};

export default StageSelector;
