import React from "react";
import { stages } from "@sendou-ink/shared/constants/stages";
import { PlannerMapBg } from "pages/plans";
import ModeImage from "components/common/ModeImage";
import { HStack } from "@chakra-ui/core";
import { Mode } from "@sendou-ink/shared";

interface StageSelectorProps {
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  currentBackground: PlannerMapBg;
  changeMode: (mode: Mode) => void;
  //changeTide: (tide) => void
}

const StageSelector: React.FC<StageSelectorProps> = ({
  handleChange,
  currentBackground,
  changeMode,
}) => {
  return (
    <>
      <select placeholder="Change background" onChange={handleChange}>
        {stages.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
        <option value="Spawning Grounds">Spawning Grounds</option>
        <option value="Marooner's Bay">Marooner's Bay</option>
        <option value="Lost Outpost">Lost Outpost</option>
        <option value="Salmonid Smokeyard">Salmonid Smokeyard</option>
        <option value="Ruins of Ark Polaris‎‎">Ruins of Ark Polaris‎‎</option>
      </select>
      {currentBackground.tide ? null : (
        <HStack>
          {(["SZ", "TC", "RM", "CB"] as Mode[]).map((mode) => (
            <ModeImage
              key={mode}
              onClick={() => changeMode(mode)}
              mode={mode}
              h={8}
              w={8}
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
    </>
  );
};

export default StageSelector;
