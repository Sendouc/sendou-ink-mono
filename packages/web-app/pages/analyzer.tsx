import { useState } from "react";
import { Box, FormLabel, Switch, Badge, Flex, Wrap } from "@chakra-ui/core";
import useAbilityEffects from "utils/useAbilityEffects";
import { BuildsAbilities, Ability, Weapon } from "@sendou-ink/shared";
import PageHeader from "components/common/PageHeader";
import WeaponSelector from "components/common/WeaponSelector";
import BuildStats from "components/analyzer/BuildStats";
import EditableBuilds from "components/analyzer/EditableBuilds";
import MyButton from "components/common/MyButton";
import t from "utils/mockTranslation";
import { NextPage } from "next";
import useColors from "utils/useColors";
import { FiSettings } from "react-icons/fi";

const CURRENT_PATCH = "5.3.";

const defaultBuild: BuildsAbilities = {
  headgearAbilities: ["UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN"],
  clothingAbilities: ["UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN"],
  shoesAbilities: ["UNKNOWN", "UNKNOWN", "UNKNOWN", "UNKNOWN"],
};

const BuildAnalyzerPage: NextPage = () => {
  const { colorScheme, secondaryText } = useColors();
  const [build, setBuild] = useState<BuildsAbilities>({ ...defaultBuild });
  const [otherBuild, setOtherBuild] = useState<BuildsAbilities>({
    ...defaultBuild,
  });
  const [weapon, setWeapon] = useState<Weapon>("Splattershot Jr.");
  const [showOther, setShowOther] = useState(false);
  const [showNotActualProgress, setShowNotActualProgress] = useState(false);
  const [startChartsAtZero, setStartChartsAtZero] = useState(true);
  const [otherFocused, setOtherFocused] = useState(false);
  const [hideExtra, setHideExtra] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [bonusAp, setBonusAp] = useState<Partial<Record<Ability, boolean>>>({});
  const [otherBonusAp, setOtherBonusAp] = useState<
    Partial<Record<Ability, boolean>>
  >({});
  const [lde, setLde] = useState(0);
  const [otherLde, setOtherLde] = useState(0);

  const explanations = useAbilityEffects({
    weapon,
    buildsAbilities: build,
    bonusAp,
    lde,
  });
  const otherExplanations = useAbilityEffects({
    weapon,
    buildsAbilities: otherBuild,
    bonusAp: otherBonusAp,
    lde: otherLde,
  });

  return (
    <>
      <PageHeader title={t("navigation;Build Analyzer")} />
      <Badge colorScheme={colorScheme}>Patch {CURRENT_PATCH}</Badge>

      <Box my="2rem">
        <WeaponSelector
          value={weapon}
          setValue={(weapon) => setWeapon(weapon)}
          maxW="24rem"
          size="lg"
          showImage
        />
      </Box>
      <Wrap justify="space-between">
        <Box>
          <Box position="sticky" top={0}>
            {weapon && (
              <EditableBuilds
                build={build}
                otherBuild={otherBuild}
                setBuild={otherFocused ? setOtherBuild : setBuild}
                showOther={showOther}
                setShowOther={setShowOther}
                changeFocus={() => {
                  setOtherFocused(!otherFocused);
                }}
                otherFocused={otherFocused}
                bonusAp={bonusAp}
                setBonusAp={setBonusAp}
                otherBonusAp={otherBonusAp}
                setOtherBonusAp={setOtherBonusAp}
                lde={lde}
                setLde={setLde}
                otherLde={otherLde}
                setOtherLde={setOtherLde}
              />
            )}
          </Box>
        </Box>
        <Box>
          <MyButton
            leftIcon={<FiSettings />}
            onClick={() => setShowSettings(!showSettings)}
            my="1rem"
          >
            {showSettings
              ? t("analyzer;Hide settings")
              : t("analyzer;Show settings")}
          </MyButton>
          {showSettings && (
            <Box my="1em">
              <Switch
                id="show-all"
                color="blue"
                isChecked={hideExtra}
                onChange={() => setHideExtra(!hideExtra)}
                mr="0.5em"
              />
              <FormLabel htmlFor="show-all">
                {t("analyzer;Hide stats at base value")}
              </FormLabel>

              <Box>
                <Switch
                  id="show-not-actual"
                  color="blue"
                  isChecked={showNotActualProgress}
                  onChange={() =>
                    setShowNotActualProgress(!showNotActualProgress)
                  }
                  mr="0.5em"
                />
                <FormLabel htmlFor="show-not-actual">
                  {t("analyzer;Progress bars show progress to max value")}
                </FormLabel>
              </Box>
              <Box>
                <Switch
                  id="charts-zero"
                  color="blue"
                  isChecked={startChartsAtZero}
                  onChange={() => setStartChartsAtZero(!startChartsAtZero)}
                  mr="0.5em"
                />
                <FormLabel htmlFor="charts-zero">
                  {t("analyzer;Start charts Y axis from zero")}
                </FormLabel>
              </Box>
            </Box>
          )}
          <Box m="1rem" w={["95%", null, "30rem"]}>
            <BuildStats
              build={build}
              explanations={explanations}
              otherExplanations={showOther ? otherExplanations : undefined}
              hideExtra={hideExtra}
              showNotActualProgress={showNotActualProgress}
              startChartsAtZero={startChartsAtZero}
            />
          </Box>
        </Box>
      </Wrap>
    </>
  );
};

export default BuildAnalyzerPage;
