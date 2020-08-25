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
import { FaPlus, FaMinus } from "react-icons/fa";
import HeadOnlyToggle from "./HeadOnlyToggle";
import LdeSlider from "./LdeSlider";

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
  const buildToEdit = otherFocused ? otherBuild : build;
  const handleChange = (value: Object) =>
    setBuild({ ...buildToEdit, ...value });

  const handleAbilityButtonClick = (ability: Ability) => {
    if (headOnlyAbilities.indexOf(ability as any) !== -1) {
      if (buildToEdit.headgearAbilities![0] === "UNKNOWN") {
        handleChange({
          headgear: [
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
          clothing: [
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
          shoes: [
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
          headgear: copy,
        });
        return;
      }

      const clothingI = buildToEdit.clothingAbilities!.indexOf("UNKNOWN");
      if (clothingI !== -1) {
        const copy = buildToEdit.clothingAbilities!.slice();
        copy[clothingI] = ability as ClothingOnlyAbility | StackableAbility;
        handleChange({
          clothing: copy,
        });
        return;
      }

      const shoesI = buildToEdit.shoesAbilities!.indexOf("UNKNOWN");
      if (shoesI !== -1) {
        const copy = buildToEdit.shoesAbilities!.slice();
        copy[shoesI] = ability as ShoesOnlyAbility | StackableAbility;
        handleChange({
          shoes: copy,
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
        headgear: copy,
      });
    } else if (slot === "CLOTHING") {
      const copy = buildToEdit.clothingAbilities!.slice();
      copy[index] = "UNKNOWN";
      handleChange({
        clothing: copy,
      });
    } else {
      const copy = buildToEdit.shoesAbilities!.slice();
      copy[index] = "UNKNOWN";
      handleChange({
        shoes: copy,
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
        icon={showOther ? FaMinus : FaPlus}
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
        <Flex flexDirection="column">
          {showOther && (
            <MyButton
              disabled={!otherFocused}
              color="orange"
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
              disabled={otherFocused}
              color="blue"
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
