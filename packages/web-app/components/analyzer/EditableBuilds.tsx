import AbilityButtons from "components/builds/AbilityButtons";
import ViewSlots from "components/builds/ViewSlots";
import { Box, Flex } from "@chakra-ui/core";
import {
  BuildsAbilities,
  Ability,
  HeadOnlyAbility,
  ClothingOnlyAbility,
  ShoesOnlyAbility,
  StackableAbility,
  headOnlyAbilities,
  clothingOnlyAbilities,
  shoesOnlyAbilities,
} from "@sendou-ink/shared";
import MyButton from "components/common/MyButton";
import HeadOnlyToggle from "./HeadOnlyToggle";
import LdeSlider from "./LdeSlider";
import useColors from "utils/useColors";
import { FiEdit3, FiEdit2, FiSquare, FiCopy } from "react-icons/fi";

interface EditableBuildsProps {
  build: Partial<BuildsAbilities>;
  otherBuild: Partial<BuildsAbilities>;
  setBuild: React.Dispatch<React.SetStateAction<BuildsAbilities>>;
  showOther: boolean;
  setShowOther: React.Dispatch<React.SetStateAction<boolean>>;
  otherFocused: boolean;
  changeFocus: () => void;
  bonusAp: Partial<Record<Ability, boolean>>;
  setBonusAp: React.Dispatch<
    React.SetStateAction<Partial<Record<Ability, boolean>>>
  >;
  otherBonusAp: Partial<Record<Ability, boolean>>;
  setOtherBonusAp: React.Dispatch<
    React.SetStateAction<Partial<Record<Ability, boolean>>>
  >;
  lde: number;
  otherLde: number;
  setLde: React.Dispatch<React.SetStateAction<number>>;
  setOtherLde: React.Dispatch<React.SetStateAction<number>>;
}

const EditableBuilds: React.FC<EditableBuildsProps> = ({
  build,
  otherBuild,
  setBuild,
  showOther,
  setShowOther,
  otherFocused,
  changeFocus,
  bonusAp,
  setBonusAp,
  otherBonusAp,
  setOtherBonusAp,
  lde,
  otherLde,
  setLde,
  setOtherLde,
}) => {
  const { colorScheme, secondaryColorScheme } = useColors();
  const buildToEdit = otherFocused ? otherBuild : build;
  const handleChange = (
    value: Partial<Record<keyof BuildsAbilities, Ability[]>>
  ) => setBuild({ ...buildToEdit, ...value } as BuildsAbilities);

  const handleAbilityButtonClick = (ability: Ability) => {
    if (headOnlyAbilities.indexOf(ability as any) !== -1) {
      if (buildToEdit.headgearAbilities![0] === "UNKNOWN") {
        handleChange({
          headgearAbilities: [
            ability,
            buildToEdit.headgearAbilities![1],
            buildToEdit.headgearAbilities![2],
            buildToEdit.headgearAbilities![3],
          ],
        });
      }
    } else if (clothingOnlyAbilities.indexOf(ability as any) !== -1) {
      if (buildToEdit.clothingAbilities![0] === "UNKNOWN") {
        handleChange({
          clothingAbilities: [
            ability,
            buildToEdit.clothingAbilities![1],
            buildToEdit.clothingAbilities![2],
            buildToEdit.clothingAbilities![3],
          ],
        });
      }
    } else if (shoesOnlyAbilities.indexOf(ability as any) !== -1) {
      if (buildToEdit.shoesAbilities![0] === "UNKNOWN") {
        handleChange({
          shoesAbilities: [
            ability,
            buildToEdit.shoesAbilities![1],
            buildToEdit.shoesAbilities![2],
            buildToEdit.shoesAbilities![3],
          ],
        });
      }
    } else {
      const headI = buildToEdit.headgearAbilities!.indexOf("UNKNOWN");
      if (headI !== -1) {
        const copy = buildToEdit.headgearAbilities!.slice();
        copy[headI] = ability as HeadOnlyAbility | StackableAbility;
        handleChange({
          headgearAbilities: copy,
        });
        return;
      }

      const clothingI = buildToEdit.clothingAbilities!.indexOf("UNKNOWN");
      if (clothingI !== -1) {
        const copy = buildToEdit.clothingAbilities!.slice();
        copy[clothingI] = ability as ClothingOnlyAbility | StackableAbility;
        handleChange({
          clothingAbilities: copy,
        });
        return;
      }

      const shoesI = buildToEdit.shoesAbilities!.indexOf("UNKNOWN");
      if (shoesI !== -1) {
        const copy = buildToEdit.shoesAbilities!.slice();
        copy[shoesI] = ability as ShoesOnlyAbility | StackableAbility;
        handleChange({
          shoesAbilities: copy,
        });
      }
    }
  };

  const handleClickBuildAbility = (
    slot: "HEAD" | "CLOTHING" | "SHOES",
    index: number
  ) => {
    if (slot === "HEAD") {
      const copy = buildToEdit.headgearAbilities!.slice();
      copy[index] = "UNKNOWN";
      handleChange({
        headgearAbilities: copy,
      });
    } else if (slot === "CLOTHING") {
      const copy = buildToEdit.clothingAbilities!.slice();
      copy[index] = "UNKNOWN";
      handleChange({
        clothingAbilities: copy,
      });
    } else {
      const copy = buildToEdit.shoesAbilities!.slice();
      copy[index] = "UNKNOWN";
      handleChange({
        shoesAbilities: copy,
      });
    }
  };

  const headAbility = build.headgearAbilities
    ? build.headgearAbilities[0]
    : "SSU";
  const otherHeadAbility = otherBuild.headgearAbilities
    ? otherBuild.headgearAbilities[0]
    : "SSU";

  return (
    <>
      <MyButton
        leftIcon={showOther ? <FiSquare /> : <FiCopy />}
        onClick={() => {
          if (showOther && otherFocused) {
            changeFocus();
          }
          setShowOther(!showOther);
        }}
        mt="1em"
        mb="2em"
      >
        {showOther ? "Stop comparing" : "Compare"}
      </MyButton>
      <Flex justifyContent="space-evenly" flexWrap="wrap" mb="1em">
        <Flex flexDirection="column" pr="1rem">
          {showOther && (
            <MyButton
              leftIcon={!otherFocused ? <FiEdit3 /> : <FiEdit2 />}
              disabled={!otherFocused}
              colorScheme={colorScheme}
              onClick={() => changeFocus()}
            >
              {!otherFocused ? "Editing" : "Edit"}
            </MyButton>
          )}
          <ViewSlots
            abilities={build}
            onAbilityClick={!otherFocused ? handleClickBuildAbility : undefined}
            m="1em"
            cursor={!otherFocused ? undefined : "not-allowed"}
          />
          {["OG", "CB"].includes(headAbility) && (
            <HeadOnlyToggle
              ability={headAbility as any}
              active={bonusAp[headAbility] ?? false}
              setActive={() =>
                setBonusAp({
                  ...bonusAp,
                  [headAbility]: !bonusAp[headAbility],
                })
              }
            />
          )}
          {headAbility === "LDE" && (
            <LdeSlider
              value={lde}
              setValue={(value: number) => setLde(value)}
            />
          )}
        </Flex>
        {showOther && (
          <Flex flexDirection="column">
            <MyButton
              leftIcon={otherFocused ? <FiEdit3 /> : <FiEdit2 />}
              disabled={otherFocused}
              colorScheme={secondaryColorScheme}
              onClick={() => changeFocus()}
            >
              {otherFocused ? "Editing" : "Edit"}
            </MyButton>
            <ViewSlots
              abilities={otherBuild}
              onAbilityClick={
                otherFocused ? handleClickBuildAbility : undefined
              }
              m="1em"
              cursor={otherFocused ? undefined : "not-allowed"}
            />
            {["OG", "CB"].includes(otherHeadAbility) && (
              <HeadOnlyToggle
                ability={otherHeadAbility as any}
                active={otherBonusAp[otherHeadAbility] ?? false}
                setActive={() =>
                  setOtherBonusAp({
                    ...otherBonusAp,
                    [otherHeadAbility]: !otherBonusAp[otherHeadAbility],
                  })
                }
                isOther
              />
            )}
            {otherHeadAbility === "LDE" && (
              <LdeSlider
                value={otherLde}
                setValue={(value: number) => setOtherLde(value)}
              />
            )}
          </Flex>
        )}
      </Flex>
      <Box mt="1em">
        <AbilityButtons
          onClick={(ability) => handleAbilityButtonClick(ability)}
        />
      </Box>
    </>
  );
};

export default EditableBuilds;
