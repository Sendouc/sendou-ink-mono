import {
  BuildsAbilities,
  Ability,
  Weapon,
  SubWeapon,
  SpecialWeapon,
} from "@sendou-ink/shared";
import { useEffect, useState } from "react";
import { getEffect } from "utils/getAbilityEffect";
import weaponJson from "utils/weaponData.json";
import abilityJson from "utils/abilityData.json";
import t from "./mockTranslation";

export interface Explanation {
  title: string;
  effect: string;
  effectFromMax: number;
  effectFromMaxActual: number;
  ability: Ability;
  info?: string;
  getEffect: (ap: number) => number;
  ap: number;
}

const MAX_AP = 57;

interface useAbilityEffectsArgs {
  weapon: Weapon;
  buildsAbilities: BuildsAbilities;
  bonusAp?: Partial<Record<Ability, boolean>>;
  lde?: number;
}

function buildToAP({
  buildsAbilities,
  bonusAp,
  lde,
}: Required<useAbilityEffectsArgs>) {
  const AP: Partial<Record<Ability, number>> = {};

  if (buildsAbilities.headgearAbilities) {
    buildsAbilities.headgearAbilities.forEach((ability, index) => {
      if (ability !== "UNKNOWN") {
        if (ability === "OG" && bonusAp["OG"]) {
          for (const ability of ["SSU", "RSU", "RES"]) {
            const a = ability as Ability;
            const existing = AP[a] ?? 0;
            AP[a] = existing + 15;
          }
        }
        if (ability === "CB" && bonusAp["CB"]) {
          for (const ability of ["ISM", "ISS", "REC", "RSU", "SSU", "SCU"]) {
            const a = ability as Ability;
            const existing = AP[a] ?? 0;
            AP[a] = existing + 10;
          }
        }
        if (ability === "LDE" && lde > 0) {
          for (const ability of ["ISM", "ISS", "REC"]) {
            const a = ability as Ability;
            const existing = AP[a] ?? 0;
            const toAdd = Math.floor((24 / 21) * lde);
            AP[a] = existing + toAdd;
          }
        }
        const existing = AP[ability] ?? 0;
        const toAdd = index === 0 ? 10 : 3;
        AP[ability] = existing + toAdd;
      }
    });
  }

  let subWorth = 3;

  if (buildsAbilities.clothingAbilities) {
    buildsAbilities.clothingAbilities.forEach((ability, index) => {
      if (ability !== "UNKNOWN") {
        if (ability === "AD") subWorth *= 2;
        const existing = AP[ability] ?? 0;
        const toAdd = index === 0 ? 10 : subWorth;
        AP[ability] = existing + toAdd;
      }
    });
  }

  if (buildsAbilities.shoesAbilities) {
    buildsAbilities.shoesAbilities.forEach((ability, index) => {
      if (ability !== "UNKNOWN") {
        const existing = AP[ability] ?? 0;
        const toAdd = index === 0 ? 10 : 3;
        AP[ability] = existing + toAdd;
      }
    });
  }

  return AP;
}

const useAbilityEffects = ({
  weapon,
  buildsAbilities,
  bonusAp = {},
  lde = 0,
}: useAbilityEffectsArgs) => {
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const weaponData: Record<
    Weapon | SubWeapon | SpecialWeapon,
    any
  > = weaponJson;

  function calculateISM(amount: number) {
    const ISM = abilityJson["Ink Saver (Main)"];
    const buildWeaponData = weaponData[weapon];
    const inkSaverLvl = buildWeaponData.InkSaverLv as "High" | "Middle" | "Low";

    const keyObj = {
      High: {
        High: "ConsumeRt_Main_High_High",
        Mid: "ConsumeRt_Main_High_Mid",
        Low: "ConsumeRt_Main_High_Low",
      },
      Middle: {
        High: "ConsumeRt_Main_High",
        Mid: "ConsumeRt_Main_Mid",
        Low: "ConsumeRt_Main_Low",
      },
      Low: {
        High: "ConsumeRt_Main_Low_High",
        Mid: "ConsumeRt_Main_Low_Mid",
        Low: "ConsumeRt_Main_Low_Low",
      },
    } as const;

    const high = ISM[keyObj[inkSaverLvl].High];
    const mid = ISM[keyObj[inkSaverLvl].Mid];
    const low = ISM[keyObj[inkSaverLvl].Low];
    const highMidLow = [high, mid, low];
    const effect = getEffect(highMidLow, amount);

    const toReturn = [];

    const mInkConsume = buildWeaponData.mInkConsume;
    if (mInkConsume) {
      const title =
        weapon.includes("Splatling") || weapon.includes("Nautilus")
          ? t("analyzer;Full charges per ink tank")
          : t("analyzer;Shots per ink tank");

      const tank = weapon.includes("Jr.") ? 1.1 : 1;
      toReturn.push({
        title,
        effect: `${parseFloat((tank / (mInkConsume * effect[0])).toFixed(2))}`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (getEffect(highMidLow, MAX_AP)[0] / effect[0]) * 100,
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (tank / (mInkConsume * getEffect(highMidLow, ap)[0])).toFixed(2)
          ),
        ap: amount,
      });
    }

    const mInkConsumeRepeat = buildWeaponData.mInkConsume_Repeat;
    if (mInkConsumeRepeat && mInkConsumeRepeat !== mInkConsume) {
      toReturn.push({
        title: t("analyzer;Shots per ink tank (autofire mode)"),
        effect: `${parseFloat(
          (1 / (mInkConsumeRepeat * effect[0])).toFixed(2)
        )}`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (getEffect(highMidLow, MAX_AP)[0] / effect[0]) * 100,
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (1 / (mInkConsumeRepeat * getEffect(highMidLow, ap)[0])).toFixed(2)
          ),
        ap: amount,
      });
    }

    const mFullChargeInkConsume = buildWeaponData.mFullChargeInkConsume;
    if (mFullChargeInkConsume) {
      toReturn.push({
        title: t("analyzer;Fully charged shots per ink tank"),
        effect: `${parseFloat(
          (1 / (mFullChargeInkConsume * effect[0])).toFixed(2)
        )}`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (getEffect(highMidLow, MAX_AP)[0] / effect[0]) * 100,
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (
              1 /
              (mFullChargeInkConsume * getEffect(highMidLow, ap)[0])
            ).toFixed(2)
          ),
        ap: amount,
      });
    }

    const mMinChargeInkConsume = buildWeaponData.mMinChargeInkConsume;
    if (mMinChargeInkConsume) {
      toReturn.push({
        title: t("analyzer;Tap shots per ink tank"),
        effect: `${parseFloat(
          (1 / (mMinChargeInkConsume * effect[0])).toFixed(2)
        )}`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (getEffect(highMidLow, MAX_AP)[0] / effect[0]) * 100,
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (1 / (mMinChargeInkConsume * getEffect(highMidLow, ap)[0])).toFixed(
              2
            )
          ),
        ap: amount,
      });
    }

    const mInkConsumeSplashJump = buildWeaponData.mInkConsumeSplash_Jump;
    const mInkConsumeSplashStand = buildWeaponData.mInkConsumeSplash_Stand;

    if (
      mInkConsumeSplashJump &&
      mInkConsumeSplashJump === mInkConsumeSplashStand
    ) {
      toReturn.push({
        title: t("analyzer;Swings per ink tank"),
        effect: `${parseFloat(
          (1 / (mInkConsumeSplashJump * effect[0])).toFixed(2)
        )}`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (getEffect(highMidLow, MAX_AP)[0] / effect[0]) * 100,
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (
              1 /
              (mInkConsumeSplashJump * getEffect(highMidLow, ap)[0])
            ).toFixed(2)
          ),
        ap: amount,
      });
    } else if (mInkConsumeSplashJump && mInkConsumeSplashStand) {
      toReturn.push({
        title: t("analyzer;Ground swings per ink tank"),
        effect: `${parseFloat(
          (1 / (mInkConsumeSplashStand * effect[0])).toFixed(2)
        )}`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (getEffect(highMidLow, MAX_AP)[0] / effect[0]) * 100,
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (
              1 /
              (mInkConsumeSplashStand * getEffect(highMidLow, ap)[0])
            ).toFixed(2)
          ),
        ap: amount,
      });

      toReturn.push({
        title: t("analyzer;Jumping swings per ink tank"),
        effect: `${parseFloat(
          (1 / (mInkConsumeSplashJump * effect[0])).toFixed(2)
        )}`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (getEffect(highMidLow, MAX_AP)[0] / effect[0]) * 100,
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (
              1 /
              (mInkConsumeSplashJump * getEffect(highMidLow, ap)[0])
            ).toFixed(2)
          ),
        ap: amount,
      });
    }

    const mSideStepInkConsume = buildWeaponData.mSideStepInkConsume;
    if (mSideStepInkConsume) {
      toReturn.push({
        title: t("analyzer;Dodge roll ink consumption"),
        effect: `${parseFloat(
          (mSideStepInkConsume * effect[0] * 100).toFixed(2)
        )}% ${t("analyzer;of ink tank")}`,
        effectFromMax: effect[1],
        effectFromMaxActual: parseFloat(
          (mSideStepInkConsume * effect[0] * 100).toFixed(2)
        ),
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (mSideStepInkConsume * getEffect(highMidLow, ap)[0] * 100).toFixed(
              2
            )
          ),
        ap: amount,
      });
    }

    const mInkConsumeUmbrella = buildWeaponData.mInkConsumeUmbrella;
    if (mInkConsumeUmbrella) {
      toReturn.push({
        title: t("analyzer;Brella shield launch ink consumption"),
        effect: `${parseFloat(
          (mInkConsumeUmbrella * effect[0] * 100).toFixed(2)
        )}% ${t("analyzer;of ink tank")}`,
        effectFromMax: effect[1],
        effectFromMaxActual: parseFloat(
          (mInkConsumeUmbrella * effect[0] * 100).toFixed(2)
        ),
        ability: "ISM" as Ability,
        getEffect: (ap: number) =>
          parseFloat(
            (mInkConsumeUmbrella * getEffect(highMidLow, ap)[0] * 100).toFixed(
              2
            )
          ),
        ap: amount,
      });
    }

    return toReturn;
  }

  function calculateISS(amount: number) {
    const ISS = abilityJson["Ink Saver (Sub)"];
    const buildWeaponData = weaponData[weapon];
    const subWeapon = buildWeaponData.Sub! as SubWeapon;

    const subWeaponData = weaponData[subWeapon];
    let inkConsumption = subWeaponData.mInkConsume!;

    const letterGrade = weaponData[subWeapon].InkSaverType;
    const highKey = `ConsumeRt_Sub_${letterGrade}_High` as keyof typeof ISS;
    const midKey = `ConsumeRt_Sub_${letterGrade}_Mid` as keyof typeof ISS;
    const lowKey = `ConsumeRt_Sub_${letterGrade}_Low` as keyof typeof ISS;

    const high = ISS[highKey];
    const mid = ISS[midKey];
    const low = ISS[lowKey];
    const highMidLow = [high, mid, low];
    const effect = getEffect(highMidLow, amount);
    const tank = weapon.includes("Jr.") ? 1.1 : 1;

    const subWeaponTranslated = t(`game;${subWeapon}`);
    return [
      {
        title: `${subWeaponTranslated} ${t("analyzer;ink consumption")}`,
        effect: `${parseFloat(
          (((effect[0] * inkConsumption) / tank) * 100).toFixed(2)
        )}% ${t("analyzer;of ink tank")}`,
        effectFromMax: effect[1],
        effectFromMaxActual: parseFloat(
          (((effect[0] * inkConsumption) / tank) * 100).toFixed(2)
        ),
        ability: "ISS" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              ((inkConsumption * getEffect(highMidLow, ap)[0]) / tank) *
              100
            ).toFixed(2)
          ),
      },
    ];
  }

  function calculateREC(amount: number) {
    const REC = abilityJson["Ink Recovery Up"];

    const highKeySquid = "RecoverFullFrm_Ink_High";
    const midKeySquid = "RecoverFullFrm_Ink_Mid";
    const lowKeySquid = "RecoverFullFrm_Ink_Low";
    const highSquid = REC[highKeySquid];
    const midSquid = REC[midKeySquid];
    const lowSquid = REC[lowKeySquid];
    const highMidLowSquid = [highSquid, midSquid, lowSquid];
    const effectSquid = getEffect(highMidLowSquid, amount);

    const tank = weapon.includes("Jr.") ? 1.1 : 1;

    return [
      {
        title: t("analyzer;Ink tank recovery from empty to full (squid form)"),
        effect: `${Math.ceil(effectSquid[0] * tank)} ${t(
          "analyzer;frames"
        )} (${parseFloat(
          (Math.ceil(effectSquid[0] * tank) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effectSquid[1],
        effectFromMaxActual:
          (effectSquid[0] / getEffect(highMidLowSquid, 0)[0]) * 100,
        ability: "REC" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          Math.ceil(getEffect(highMidLowSquid, ap)[0] * tank),
      },
    ];
  }

  function calculateRSU(amount: number) {
    const RSU = abilityJson["Run Speed Up"];

    const buildWeaponData = weaponData[weapon];
    const grade = buildWeaponData.ShotMoveVelType; // "A" | "B" | "C" | "D" | "E"
    const moveLv = buildWeaponData.MoveVelLv; // "Low" | "Middle" | "High"

    const commonKey =
      moveLv === "Middle"
        ? ""
        : moveLv === "Low"
        ? "_BigWeapon"
        : "_ShortWeapon";
    const highKey = `MoveVel_Human${commonKey}_High` as keyof typeof RSU;
    const midKey = `MoveVel_Human${commonKey}_Mid` as keyof typeof RSU;
    const lowKey = `MoveVel_Human${commonKey}_Low` as keyof typeof RSU;

    const high = RSU[highKey];
    const mid = RSU[midKey];
    const low = RSU[lowKey];
    const highMidLow = [high, mid, low];

    const moveEffect = getEffect(highMidLow, amount);

    const highShootKey = `MoveVelRt_Human_Shot${grade}_High` as keyof typeof RSU;
    const midShootKey = `MoveVelRt_Human_Shot${grade}_Mid` as keyof typeof RSU;
    const lowShootKey = `MoveVelRt_Human_Shot${grade}_Low` as keyof typeof RSU;
    const highShoot = RSU[highShootKey];
    const midShoot = RSU[midShootKey];
    const lowShoot = RSU[lowShootKey];
    const highMidLowShoot = [highShoot, midShoot, lowShoot];

    const shootEffect = getEffect(highMidLowShoot, amount);
    const moveSpeed = buildWeaponData.mMoveSpeed;

    return [
      {
        title: t("analyzer;Run speed"),
        effect: `${parseFloat(moveEffect[0].toFixed(2))} ${t(
          "analyzer;distance units / frame"
        )}`,
        effectFromMax: moveEffect[1],
        effectFromMaxActual: (moveEffect[0] / 2.4) * 100,
        ability: "RSU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLow, ap)[0].toFixed(4)),
      },
      {
        title: t("analyzer;Run speed (firing)"),
        effect: `${parseFloat((shootEffect[0] * moveSpeed).toFixed(2))} ${t(
          "analyzer;distance units / frame"
        )}`,
        effectFromMax: shootEffect[1],
        effectFromMaxActual: ((shootEffect[0] * moveSpeed) / 2.4) * 100,
        ability: "RSU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (getEffect(highMidLowShoot, ap)[0] * moveSpeed).toFixed(4)
          ),
      },
    ];
  }

  function calculateSSU(amount: number) {
    const SSU = abilityJson["Swim Speed Up"];

    const buildWeaponData = weaponData[weapon];
    const moveLv = buildWeaponData.MoveVelLv; // "Low" | "Middle" | "High"

    const commonKey =
      moveLv === "Middle"
        ? ""
        : moveLv === "Low"
        ? "_BigWeapon"
        : "_ShortWeapon";
    const highKey = `MoveVel_Stealth${commonKey}_High` as keyof typeof SSU;
    const midKey = `MoveVel_Stealth${commonKey}_Mid` as keyof typeof SSU;
    const lowKey = `MoveVel_Stealth${commonKey}_Low` as keyof typeof SSU;

    const high = SSU[highKey];
    const mid = SSU[midKey];
    const low = SSU[lowKey];
    const highMidLow = [high, mid, low];

    const hasNinjaSquid = buildsAbilities.clothingAbilities![0] === "NS";
    const effect = getEffect(highMidLow, amount, hasNinjaSquid);

    const speed = hasNinjaSquid ? effect[0] * 0.9 : effect[0];

    return [
      {
        title: t("analyzer;Swim speed"),
        effect: `${parseFloat(speed.toFixed(2))} ${t(
          "analyzer;distance units / frame"
        )}`,
        effectFromMax: effect[1],
        effectFromMaxActual: (speed / 2.4) * 100,
        ability: "SSU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLow, ap)[0].toFixed(3)),
      },
    ];
  }

  function calculateSCU(amount: number) {
    const SCU = abilityJson["Special Charge Up"];

    const buildWeaponData = weaponData[weapon];
    const points = buildWeaponData.SpecialCost!;

    const high = SCU.SpecialRt_Charge_High;
    const mid = SCU.SpecialRt_Charge_Mid;
    const low = SCU.SpecialRt_Charge_Low;
    const highMidLow = [high, mid, low];

    const effect = getEffect(highMidLow, amount);

    return [
      {
        title: t("analyzer;Points to special"),
        effect: `${Math.ceil(points / effect[0])}${t(
          "analyzer;pointShort"
        )} (${parseFloat((effect[0] * 100).toFixed(2))}% ${t(
          "analyzer;speed"
        )})`,
        effectFromMax: effect[1],
        effectFromMaxActual: (getEffect(highMidLow, 0)[0] / effect[0]) * 100,
        ability: "SCU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          Math.ceil(points / getEffect(highMidLow, ap)[0]),
      },
    ];
  }

  function calculateSS(amountBeforeRP: number) {
    const respawnPunishAPMultiplier =
      buildsAbilities.clothingAbilities[0] === "RP" ? 0.7 : 1;
    const respawnPunishEffectMultiplier =
      buildsAbilities.clothingAbilities[0] === "RP" ? 0.775 : 1;
    const amount = Math.floor(amountBeforeRP * respawnPunishAPMultiplier);

    const SS = abilityJson["Special Saver"];

    const high = SS.SpecialRt_Restart_High;
    const mid = SS.SpecialRt_Restart_Mid;
    const low = SS.SpecialRt_Restart_Low;
    const highMidLow = [high, mid, low];

    const [specialLostBeforeRP, effectFromMax] = getEffect(highMidLow, amount);
    const specialLost = specialLostBeforeRP * respawnPunishEffectMultiplier;

    const toReturn = [];

    toReturn.push({
      title: t("analyzer;Special lost when killed"),
      effect: `${parseFloat(((1.0 - specialLost) * 100).toFixed(2))}% ${t(
        "analyzer;of the charge"
      )}`,
      effectFromMax,
      effectFromMaxActual: (1.0 - specialLost) * 100,
      ability: "SS" as Ability,
      ap: amount,
      getEffect: (ap: number) =>
        parseFloat(((1.0 - getEffect(highMidLow, ap)[0]) * 100).toFixed(2)),
    });

    if (weaponData[weapon].Special === "Splashdown") {
      const high = SS.SpecialRt_Restart_SuperLanding_High;
      const mid = SS.SpecialRt_Restart_SuperLanding_Mid;
      const low = SS.SpecialRt_Restart_SuperLanding_Low;
      const highMidLow = [high, mid, low];

      const [specialLostBeforeRP] = getEffect(highMidLow, amount);
      const specialLost = specialLostBeforeRP * respawnPunishEffectMultiplier;

      const lost = specialLost > 1 ? 1 : specialLost;
      const effectAtZero = getEffect(highMidLow, 0);
      const fromMax = (lost - effectAtZero[0]) / 0.25;

      toReturn.push({
        title: t("analyzer;Special lost when killed mid-Splashdown"),
        effect: `${parseFloat(((1.0 - lost) * 100).toFixed(2))}% ${t(
          "analyzer;of the charge"
        )}`,
        effectFromMax: fromMax,
        effectFromMaxActual: parseFloat(((1.0 - lost) * 100).toFixed(2)),
        ability: "SS" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          Math.max(
            0,
            parseFloat(((1.0 - getEffect(highMidLow, ap)[0]) * 100).toFixed(2))
          ),
      });
    }

    return toReturn;
  }

  function calculateSPU(amount: number) {
    const buildWeaponData = weaponData[weapon];
    const specialWeapon = buildWeaponData.Special! as SpecialWeapon;
    const specialWeaponData = weaponData[specialWeapon];

    const toReturn = [];

    const specialWeaponTranslated = t(`game;${specialWeapon}`);

    if (
      specialWeaponData.mPaintGauge_SpecialFrm &&
      specialWeaponData.mPaintGauge_SpecialFrmM &&
      specialWeaponData.mPaintGauge_SpecialFrmH &&
      specialWeaponData.mPaintGauge_SpecialFrmH >
        specialWeaponData.mPaintGauge_SpecialFrmM &&
      specialWeaponData.mPaintGauge_SpecialFrmM >
        specialWeaponData.mPaintGauge_SpecialFrm
    ) {
      const high = specialWeaponData.mPaintGauge_SpecialFrmH;
      const mid = specialWeaponData.mPaintGauge_SpecialFrmM;
      const low = specialWeaponData.mPaintGauge_SpecialFrm;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;duration")}`,
        effect: `${Math.ceil(effect[0])} ${t("analyzer;frames")} (${parseFloat(
          (Math.ceil(effect[0]) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        info:
          specialWeapon === "Inkjet"
            ? t(
                "analyzer;Special Power Up also increases Inkjet's shots' painting and blast radius"
              )
            : undefined,
        ap: amount,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLow, ap)[0]),
      });
    }

    if (specialWeapon === "Tenta Missiles") {
      const high = specialWeaponData.mTargetInCircleRadiusHigh;
      const mid = specialWeaponData.mTargetInCircleRadiusMid;
      const low = specialWeaponData.mTargetInCircleRadius;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);

      const highPaint = specialWeaponData.mBurst_PaintRHigh;
      const midPaint = specialWeaponData.mBurst_PaintRMid;
      const lowPaint = specialWeaponData.mBurst_PaintR;
      const highMidLowPaint = [highPaint, midPaint, lowPaint];

      const effectPaint = getEffect(highMidLowPaint, amount);
      const effectPaintAtZero = getEffect(highMidLowPaint, 0);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;reticle size")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(3)
          ),
      });
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;ink coverage")}`,
        effect: `${parseFloat(
          ((effectPaint[0] / effectPaintAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effectPaint[1],
        effectFromMaxActual:
          (effectPaint[0] / getEffect(highMidLowPaint, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              (getEffect(highMidLowPaint, ap)[0] / effectPaintAtZero[0]) *
              100
            ).toFixed(3)
          ),
      });
    }

    if (specialWeapon === "Splashdown") {
      const highNear = specialWeaponData.mBurst_Radius_Near_H;
      const lowNear = specialWeaponData.mBurst_Radius_Near;
      const midNear = (highNear + lowNear) / 2;
      const highMidLowNear = [highNear, midNear, lowNear];

      const effectNear = getEffect(highMidLowNear, amount);
      const effectAtZeroNear = getEffect(highMidLowNear, 0);

      const highMiddle = specialWeaponData.mBurst_Radius_Middle_H;
      const lowMiddle = specialWeaponData.mBurst_Radius_Middle;
      const midMiddle = (highMiddle + lowMiddle) / 2;
      const highMidLowMiddle = [highMiddle, midMiddle, lowMiddle];

      const effectMiddle = getEffect(highMidLowMiddle, amount);
      const effectAtZeroMiddle = getEffect(highMidLowMiddle, 0);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;180dmg hitbox size")}`,
        effect: `${parseFloat(
          ((effectNear[0] / effectAtZeroNear[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effectNear[1],
        effectFromMaxActual:
          (effectNear[0] / getEffect(highMidLowNear, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              (getEffect(highMidLowNear, ap)[0] / effectAtZeroNear[0]) *
              100
            ).toFixed(3)
          ),
      });
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;70dmg hitbox size")}`,
        effect: `${parseFloat(
          ((effectMiddle[0] / effectAtZeroMiddle[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effectMiddle[1],
        effectFromMaxActual:
          (effectMiddle[0] / getEffect(highMidLowMiddle, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        info: t(
          "analyzer;55dmg hitbox can't be increased with Special Power Up so the total radius of the special doesn't change"
        ),
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              (getEffect(highMidLowMiddle, ap)[0] / effectAtZeroMiddle[0]) *
              100
            ).toFixed(3)
          ),
      });
    }

    if (specialWeapon === "Ink Armor") {
      const high = specialWeaponData.mEnergyAbsorbFrmH;
      const mid = specialWeaponData.mEnergyAbsorbFrmM;
      const low = specialWeaponData.mEnergyAbsorbFrm;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;activation time")}`,
        effect: `${Math.ceil(effect[0])} ${t("analyzer;frames")} (${parseFloat(
          (Math.ceil(effect[0]) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effect[1],
        ability: "SPU" as Ability,
        ap: amount,
        effectFromMaxActual: (effect[0] / getEffect(highMidLow, 0)[0]) * 100,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLow, ap)[0]),
      });
    }

    if (specialWeapon === "Ink Storm") {
      const high = specialWeaponData.mRainAreaFrameHigh;
      const mid = specialWeaponData.mRainAreaFrameMid;
      const low = specialWeaponData.mRainAreaFrame;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;duration")}`,
        effect: `${Math.ceil(effect[0])} ${t("analyzer;frames")} (${parseFloat(
          (Math.ceil(effect[0]) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effect[1],
        ability: "SPU" as Ability,
        info: t(
          "analyzer;Amount inked by Ink Storm is not increased only in how long distance the droplets are spread. Special Power Up also increases the distance you can throw the seed."
        ),
        ap: amount,
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLow, ap)[0]),
      });
    }

    if (specialWeapon === "Baller") {
      const high = specialWeaponData.mHP_High;
      const mid = specialWeaponData.mHP_Mid;
      const low = specialWeaponData.mHP_Low;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);

      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;durability")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(3)
          ),
      });

      const highHit = specialWeaponData.mBurst_Radius_MiddleHigh;
      const midHit = specialWeaponData.mBurst_Radius_MiddleMid;
      const lowHit = specialWeaponData.mBurst_Radius_Middle;
      const highMidLowHit = [highHit, midHit, lowHit];

      const effectHit = getEffect(highMidLowHit, amount);
      const effectAtZeroHit = getEffect(highMidLowHit, 0);

      toReturn.push({
        title: `${specialWeaponTranslated} ${t(
          "analyzer;55dmg explosion hitbox size"
        )}`,
        effect: `${parseFloat(
          ((effectHit[0] / effectAtZeroHit[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effectHit[1],
        effectFromMaxActual:
          (effectHit[0] / getEffect(highMidLowHit, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              (getEffect(highMidLowHit, ap)[0] / effectAtZeroHit[0]) *
              100
            ).toFixed(3)
          ),
      });
    }

    if (specialWeapon === "Bubble Blower") {
      const highSize = specialWeaponData.mBombCoreRadiusRateHigh;
      const midSize = specialWeaponData.mBombCoreRadiusRateMid;
      const lowSize = 1.0;
      const highMidLowSize = [highSize, midSize, lowSize];

      const effectSize = getEffect(highMidLowSize, amount);
      const effectAtZeroSize = getEffect(highMidLowSize, 0);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;bubble size")}`,
        effect: `${parseFloat(
          ((effectSize[0] / effectAtZeroSize[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effectSize[1],
        effectFromMaxActual:
          (effectSize[0] / getEffect(highMidLowSize, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              (getEffect(highMidLowSize, ap)[0] / effectAtZeroSize[0]) *
              100
            ).toFixed(3)
          ),
      });

      const highHit = specialWeaponData.mCollisionPlayerRadiusMaxHigh;
      const midHit = specialWeaponData.mCollisionPlayerRadiusMaxMid;
      const lowHit = specialWeaponData.mCollisionPlayerRadiusMax;
      const highMidLowHit = [highHit, midHit, lowHit];

      const effectHit = getEffect(highMidLowHit, amount);
      const effectAtZeroHit = getEffect(highMidLowHit, 0);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;explosion hitbox")}`,
        effect: `${parseFloat(
          ((effectHit[0] / effectAtZeroHit[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effectHit[1],
        effectFromMaxActual:
          (effectHit[0] / getEffect(highMidLowHit, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              (getEffect(highMidLowHit, ap)[0] / effectAtZeroHit[0]) *
              100
            ).toFixed(3)
          ),
      });
    }

    if (specialWeapon === "Booyah Bomb") {
      const high = specialWeaponData.mChargeRtAutoIncr_High;
      const mid = specialWeaponData.mChargeRtAutoIncr_Mid;
      const low = specialWeaponData.mChargeRtAutoIncr_Low;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      toReturn.push({
        title: `${specialWeaponTranslated} ${t("analyzer;autocharge speed")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        ability: "SPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(3)
          ),
      });
    }

    return toReturn;
  }

  function calculateQR(amount: number) {
    const QR = abilityJson["Quick Respawn"];

    const highAround = QR.Dying_AroudFrm_High;
    const midAround = QR.Dying_AroudFrm_Mid;
    const lowAround = QR.Dying_AroudFrm_Low;
    const highMidLowAround = [highAround, midAround, lowAround];
    const effectAround = getEffect(highMidLowAround, amount);

    const highChase = QR.Dying_ChaseFrm_High;
    const midChase = QR.Dying_ChaseFrm_Mid;
    const lowChase = QR.Dying_ChaseFrm_Low;
    const highMidLowChase = [highChase, midChase, lowChase];
    const effectChase = getEffect(highMidLowChase, amount);

    const respawnPunishExtraFrames =
      buildsAbilities.clothingAbilities[0] === "RP" ? 68 : 0;
    const totalFrames =
      Math.ceil(150 + effectAround[0] + effectChase[0]) +
      respawnPunishExtraFrames;

    const effectAtZero = Math.ceil(
      150 + getEffect(highMidLowAround, 0)[0] + getEffect(highMidLowChase, 0)[0]
    );

    return [
      {
        title: `${t("game;Quick Respawn")} ${t("analyzer;time")}`,
        effect: `${totalFrames} ${t("analyzer;frames")} (${parseFloat(
          (totalFrames / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effectAround[1],
        effectFromMaxActual: (totalFrames / effectAtZero) * 100,
        ability: "QR" as Ability,
        info: t(
          "analyzer;Quick Respawn activates when enemy kills you twice without you getting a kill in between"
        ),
        ap: amount,
        getEffect: (ap: number) =>
          Math.ceil(
            150 +
              getEffect(highMidLowChase, ap)[0] +
              getEffect(highMidLowAround, ap)[0]
          ),
      },
    ];
  }

  function calculateQSJ(amount: number) {
    const QSJ = abilityJson["Quick Super Jump"];

    const highTame = QSJ.DokanWarp_TameFrm_High;
    const midTame = QSJ.DokanWarp_TameFrm_Mid;
    const lowTame = QSJ.DokanWarp_TameFrm_Low;
    const highMidLowTame = [highTame, midTame, lowTame];
    const effectTame = getEffect(highMidLowTame, amount);

    const highMove = QSJ.DokanWarp_MoveFrm_High;
    const midMove = QSJ.DokanWarp_MoveFrm_Mid;
    const lowMove = QSJ.DokanWarp_MoveFrm_Low;
    const highMidLowMove = [highMove, midMove, lowMove];
    const effectMove = getEffect(highMidLowMove, amount);

    return [
      {
        title: `${t("game;Quick Super Jump")} ${t("analyzer;time")} ${t(
          "analyzer;(on the ground)"
        )}`,
        effect: `${Math.ceil(effectTame[0])} ${t(
          "analyzer;frames"
        )} (${parseFloat((Math.ceil(effectTame[0]) / 60).toFixed(2))} ${t(
          "analyzer;seconds"
        )})`,
        effectFromMax: effectTame[1],
        effectFromMaxActual:
          (effectTame[0] / getEffect(highMidLowTame, 0)[0]) * 100,
        ability: "QSJ" as Ability,
        ap: amount,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLowTame, ap)[0]),
      },
      {
        title: `${t("game;Quick Super Jump")} ${t("analyzer;time")} ${t(
          "analyzer;(in the air)"
        )}`,
        effect: `${Math.ceil(effectMove[0])} ${t(
          "analyzer;frames"
        )} (${parseFloat((Math.ceil(effectMove[0]) / 60).toFixed(2))} ${t(
          "analyzer;seconds"
        )})`,
        effectFromMax: effectMove[1],
        ability: "QSJ" as Ability,
        ap: amount,
        effectFromMaxActual:
          (effectMove[0] / getEffect(highMidLowMove, 0)[0]) * 100,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLowMove, ap)[0]),
      },
    ];
  }

  function calculateBRU(amount: number) {
    const BRU = abilityJson["Sub Power Up"];
    const buildWeaponData = weaponData[weapon];
    const subWeapon = buildWeaponData.Sub! as SubWeapon;
    const subWeaponData = weaponData[subWeapon];

    const toReturn = [];

    const subWeaponTranslated = t(`game;${subWeapon}`);

    if (
      [
        "Splat Bomb",
        "Suction Bomb",
        "Burst Bomb",
        "Curling Bomb",
        "Autobomb",
        "Toxic Mist",
        "Fizzy Bomb",
        "Torpedo",
        "Point Sensor",
      ].includes(subWeapon)
    ) {
      let baseKey = "BombThrow_VelZ";
      if (subWeapon === "Torpedo") baseKey = "BombThrow_VelZ_BombTako";
      if (subWeapon === "Fizzy Bomb") baseKey = "BombThrow_VelZ_BombPiyo";
      if (subWeapon === "Point Sensor") baseKey = "BombThrow_VelZ_PointSensor";
      const highKey = `${baseKey}_High` as keyof typeof BRU;
      const midKey = `${baseKey}_Mid` as keyof typeof BRU;
      const lowKey = `${baseKey}_Low` as keyof typeof BRU;
      const highVelo = BRU[highKey];
      const midVelo = BRU[midKey];
      const lowVelo = BRU[lowKey];
      const highMidLowVelo = [highVelo, midVelo, lowVelo];
      const effectVelo = getEffect(highMidLowVelo, amount);
      const effectVeloAtZero = getEffect(highMidLowVelo, 0);

      toReturn.push({
        title: `${subWeaponTranslated} ${t("analyzer;range and velocity")}`,
        effect: `${parseFloat(
          ((effectVelo[0] / effectVeloAtZero[0]) * 100).toFixed(2)
        )}% (${parseFloat(effectVelo[0].toFixed(2))})`,
        effectFromMax: effectVelo[1],
        effectFromMaxActual:
          (effectVelo[0] / getEffect(highMidLowVelo, MAX_AP)[0]) * 100,
        ability: "BRU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLowVelo, ap)[0].toFixed(2)),
      });
    }

    if (subWeapon === "Sprinkler") {
      const highFirst = subWeaponData.mPeriod_FirstHigh;
      const midFirst = subWeaponData.mPeriod_FirstMid;
      const lowFirst = subWeaponData.mPeriod_First;
      const highMidLowFirst = [highFirst, midFirst, lowFirst];
      const effectFirst = getEffect(highMidLowFirst, amount);

      toReturn.push({
        title: `${subWeaponTranslated} ${t(
          "analyzer;full-power phase duration"
        )}`,
        effect: `${Math.ceil(effectFirst[0])} ${t(
          "analyzer;frames"
        )} (${parseFloat((Math.ceil(effectFirst[0]) / 60).toFixed(2))} ${t(
          "analyzer;seconds"
        )})`,
        effectFromMax: effectFirst[1],
        ability: "BRU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (effectFirst[0] / getEffect(highMidLowFirst, MAX_AP)[0]) * 100,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLowFirst, ap)[0]),
      });

      const highSecond = subWeaponData.mPeriod_SecondHigh;
      const midSecond = subWeaponData.mPeriod_SecondMid;
      const lowSecond = subWeaponData.mPeriod_Second;
      const highMidLowSecond = [highSecond, midSecond, lowSecond];
      const effectSecond = getEffect(highMidLowSecond, amount);

      toReturn.push({
        title: `${subWeaponTranslated} ${t("analyzer;mid-phase duration")}`,
        effect: `${Math.ceil(effectSecond[0])} ${t(
          "analyzer;frames"
        )} (${parseFloat((Math.ceil(effectSecond[0]) / 60).toFixed(2))} ${t(
          "analyzer;seconds"
        )})`,
        effectFromMax: effectSecond[1],
        ability: "BRU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (effectSecond[0] / getEffect(highMidLowSecond, MAX_AP)[0]) * 100,
        getEffect: (ap: number) =>
          Math.ceil(getEffect(highMidLowSecond, ap)[0]),
      });
    }

    if (["Point Sensor", "Ink Mine"].includes(subWeapon)) {
      const high = subWeaponData.mMarkingFrameHigh;
      const mid = subWeaponData.mMarkingFrameMid;
      const low = subWeaponData.mMarkingFrame;
      const highMidLow = [high, mid, low];
      const effect = getEffect(highMidLow, amount);

      toReturn.push({
        title: `${subWeaponTranslated} ${t("analyzer;tracking duration")}`,
        effect: `${Math.ceil(effect[0])} ${t("analyzer;frames")} (${parseFloat(
          (Math.ceil(effect[0]) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effect[1],
        ability: "BRU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLow, ap)[0]),
      });
    }

    if (subWeapon === "Ink Mine") {
      const high = subWeaponData.mPlayerColRadiusHigh;
      const mid = subWeaponData.mPlayerColRadiusMid;
      const low = subWeaponData.mPlayerColRadius;
      const highMidLow = [high, mid, low];
      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);

      toReturn.push({
        title: `${subWeaponTranslated} ${t("analyzer;tracking range")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        ability: "BRU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLow, ap)[0]),
      });
    }

    if (subWeapon === "Splash Wall") {
      const high = subWeaponData.mMaxHpHigh;
      const mid = subWeaponData.mMaxHpMid;
      const low = subWeaponData.mMaxHp;
      const highMidLow = [high, mid, low];
      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);

      toReturn.push({
        title: `${subWeaponTranslated} ${t("analyzer;durability")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        ability: "BRU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (effect[0] / getEffect(highMidLow, MAX_AP)[0]) * 100,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(3)
          ),
      });
    }

    if (subWeapon === "Squid Beakon") {
      const high = subWeaponData.mSubRt_Effect_ActualCnt_High;
      const mid = subWeaponData.mSubRt_Effect_ActualCnt_Mid;
      const low = subWeaponData.mSubRt_Effect_ActualCnt_Low;
      const highMidLow = [high, mid, low];
      const effect = getEffect(highMidLow, amount);

      toReturn.push({
        title: `${subWeaponTranslated} ${t("game;Quick Super Jump")} ${t(
          "analyzer;boost"
        )}`,
        effect: `${Math.floor(effect[0])}${t("analyzer;abilityPointShort")}`,
        effectFromMax: effect[1],
        ability: "BRU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (Math.floor(effect[0]) /
            Math.floor(getEffect(highMidLow, MAX_AP)[0])) *
          100,
        getEffect: (ap: number) => Math.floor(getEffect(highMidLow, ap)[0]),
        info: t(
          "analyzer;When jumping to Sub Power Up boosted beakons QSJ AP bonus is applied on top of any existing QSJ the jumper has. 57AP can't be exceeded. Value shown is the bonus if the user of Beakon has 0AP invested in QSJ."
        ),
      });
    }

    return toReturn;
  }

  function calculateRES(amount: number) {
    const RES = abilityJson["Ink Resistance Up"];

    const highArmor = RES.OpInk_Armor_HP_High;
    const midArmor = RES.OpInk_Armor_HP_Mid;
    const lowArmor = RES.OpInk_Armor_HP_Low;
    const highMidLowArmor = [highArmor, midArmor, lowArmor];
    const effectArmor = getEffect(highMidLowArmor, amount);

    const highPerFrame = RES.OpInk_Damage_High;
    const midPerFrame = RES.OpInk_Damage_Mid;
    const lowPerFrame = RES.OpInk_Damage_Low;
    const highMidLowPerFrame = [highPerFrame, midPerFrame, lowPerFrame];
    const effectPerFrame = getEffect(highMidLowPerFrame, amount);

    const highLimit = RES.OpInk_Damage_Lmt_High;
    const midLimit = RES.OpInk_Damage_Lmt_Mid;
    const lowLimit = RES.OpInk_Damage_Lmt_Low;
    const highMidLowLimit = [highLimit, midLimit, lowLimit];
    const effectLimit = getEffect(highMidLowLimit, amount);

    const highVel = RES.OpInk_VelGnd_High;
    const midVel = RES.OpInk_VelGnd_Mid;
    const lowVel = RES.OpInk_VelGnd_Low;
    const highMidLowVel = [highVel, midVel, lowVel];
    const effectVel = getEffect(highMidLowVel, amount);

    return [
      {
        title: t("analyzer;Frames before taking damage from enemy ink"),
        effect: `${Math.ceil(effectArmor[0])} frames`,
        effectFromMax: effectArmor[1],
        ability: "RES" as Ability,
        ap: amount,
        effectFromMaxActual:
          (Math.ceil(effectArmor[0]) /
            Math.ceil(getEffect(highMidLowArmor, MAX_AP)[0])) *
          100,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLowArmor, ap)[0]),
        info: t(
          "analyzer;Ink Resistance Up also allows you to jump higher and strafe faster while shooting in enemy ink"
        ),
      },
      {
        title: t("analyzer;Damage taken in enemy ink"),
        effect: `${parseFloat((effectPerFrame[0] * 100 - 0.05).toFixed(1))}${t(
          "analyzer;hp / frame"
        )}`,
        effectFromMax: effectPerFrame[1],
        ability: "RES" as Ability,
        ap: amount,
        effectFromMaxActual:
          (parseFloat((effectPerFrame[0] * 100 - 0.05).toFixed(1)) /
            parseFloat(
              (getEffect(highMidLowPerFrame, 0)[0] * 100 - 0.05).toFixed(1)
            )) *
          100,
        getEffect: (ap: number) =>
          parseFloat(
            (getEffect(highMidLowPerFrame, ap)[0] * 100 - 0.05).toFixed(1)
          ),
      },
      {
        title: t("analyzer;Limit on the damage enemy ink can deal on you"),
        effect: `${parseFloat((effectLimit[0] * 100 - 0.05).toFixed(1))}${t(
          "analyzer;hp"
        )}`,
        effectFromMax: effectLimit[1],
        ability: "RES" as Ability,
        ap: amount,
        effectFromMaxActual: parseFloat(
          (effectLimit[0] * 100 - 0.05).toFixed(1)
        ),
        getEffect: (ap: number) =>
          parseFloat(
            (getEffect(highMidLowLimit, ap)[0] * 100 - 0.05).toFixed(1)
          ),
      },
      {
        title: t("analyzer;Run speed in enemy ink"),
        effect: `${parseFloat(effectVel[0].toFixed(2))} ${t(
          "analyzer;distance units / frame"
        )}`,
        effectFromMax: effectVel[1],
        effectFromMaxActual: (effectVel[0] / 2.4) * 100,
        ability: "RES" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLowLimit, ap)[0].toFixed(4)),
      },
    ];
  }

  function calculateBDU(amount: number) {
    const BDU = abilityJson["Bomb Defense Up DX"];

    const highSub = BDU.BurstDamageRt_SubL_High;
    const midSub = BDU.BurstDamageRt_SubL_Mid;
    const lowSub = BDU.BurstDamageRt_SubL_Low;
    const highMidLowSub = [highSub, midSub, lowSub];
    const effectSub = getEffect(highMidLowSub, amount);

    const highSpecial = BDU.BurstDamageRt_Special_High;
    const midSpecial = BDU.BurstDamageRt_Special_Mid;
    const lowSpecial = BDU.BurstDamageRt_Special_Low;
    const highMidLowSpecial = [highSpecial, midSpecial, lowSpecial];
    const effectSpecial = getEffect(highMidLowSpecial, amount);

    const inkMineData = weaponData["Ink Mine"];
    const pointSensorData = weaponData["Point Sensor"];
    let high = inkMineData.mMarkingFrameHigh;
    let mid = inkMineData.mMarkingFrameMid;
    let low = inkMineData.mMarkingFrame;
    let highMidLow = [high, mid, low];
    const mineFrames = getEffect(highMidLow, 0)[0];

    high = pointSensorData.mMarkingFrameHigh;
    mid = pointSensorData.mMarkingFrameMid;
    low = pointSensorData.mMarkingFrame;
    highMidLow = [high, mid, low];
    const sensorFrames = getEffect(highMidLow, 0)[0];

    const highSensor = BDU.MarkingTime_ShortRt_High;
    const midSensor = BDU.MarkingTime_ShortRt_Mid;
    const lowSensor = BDU.MarkingTime_ShortRt_Low;
    const highMidLowSensor = [highSensor, midSensor, lowSensor];
    const effectSensor = getEffect(highMidLowSensor, amount);

    const highMine = BDU.MarkingTime_ShortRt_Trap_High;
    const midMine = BDU.MarkingTime_ShortRt_Trap_Mid;
    const lowMine = BDU.MarkingTime_ShortRt_Trap_Low;
    const highMidLowMine = [highMine, midMine, lowMine];
    const effectMine = getEffect(highMidLowMine, amount);

    return [
      {
        title: t("analyzer;Sub Weapon damage (indirect)"),
        effect: `${parseFloat((effectSub[0] * 100).toFixed(2))}%`,
        effectFromMax: effectSub[1],
        effectFromMaxActual: effectSub[0] * 100,
        ability: "BDU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat((getEffect(highMidLowSub, ap)[0] * 100).toFixed(3)),
        info: t(
          "analyzer;Bomb Defense Up DX also lessens the damage of a direct bomb hit but it will never make a bomb not kill that would have dealt over 100dmg without any of the ability on"
        ),
      },
      {
        title: t("analyzer;Special Weapon damage (indirect)"),
        effect: `${parseFloat((effectSpecial[0] * 100).toFixed(2))}%`,
        effectFromMax: effectSpecial[1],
        effectFromMaxActual: effectSpecial[0] * 100,
        ability: "BDU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat((getEffect(highMidLowSpecial, ap)[0] * 100).toFixed(3)),
        info: t(
          "analyzer;Tenta Missiles, Inkjet, Splashdown, Baller, Bubble Blower, Booyah Bomb & Ultra Stamp generate damage lessened by Bomb Defense Up DX. OHKO's are unaffected"
        ),
      },
      {
        title: t("analyzer;Base tracking time (Point Sensor)"),
        effect: `${Math.ceil(sensorFrames * effectSensor[0])} ${t(
          "analyzer;frames"
        )} (${parseFloat(
          (Math.ceil(sensorFrames * effectSensor[0]) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effectSensor[1],
        ability: "BDU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (Math.ceil(sensorFrames * effectSensor[0]) / sensorFrames) * 100,
        getEffect: (ap: number) =>
          Math.ceil(sensorFrames * getEffect(highMidLowSensor, ap)[0]),
      },
      {
        title: t("analyzer;Base tracking time (Ink Mine)"),
        effect: `${Math.ceil(mineFrames * effectMine[0])} ${t(
          "analyzer;frames"
        )} (${parseFloat(
          (Math.ceil(mineFrames * effectMine[0]) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effectMine[1],
        ability: "BDU" as Ability,
        ap: amount,
        effectFromMaxActual:
          (Math.ceil(mineFrames * effectMine[0]) / mineFrames) * 100,
        getEffect: (ap: number) =>
          Math.ceil(mineFrames * getEffect(highMidLowMine, ap)[0]),
      },
    ];
  }

  const calculateDamage = (
    baseDamage: number,
    multiplier: number,
    cap: number
  ) => Math.min(cap, Math.floor(baseDamage * multiplier)) / 10;

  function calculateMPU(amount: number) {
    const buildWeaponData = weaponData[weapon];

    const toReturn = [];

    const weaponTranslated = t(`game;${weapon}`);

    if (
      buildWeaponData.mDamageRate_MWPUG_High &&
      buildWeaponData.mDamageRate_MWPUG_Mid &&
      buildWeaponData.mDamageMax &&
      buildWeaponData.mDamage_MWPUG_Max &&
      buildWeaponData.mDamageRate_MWPUG_High !==
        buildWeaponData.mDamageRate_MWPUG_Mid
    ) {
      const high = buildWeaponData.mDamageRate_MWPUG_High;
      const mid = buildWeaponData.mDamageRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const baseDamageMax = buildWeaponData.mDamageMax;
      const damageMax = calculateDamage(
        baseDamageMax,
        effect[0],
        buildWeaponData.mDamage_MWPUG_Max
      );
      const baseDamageMin = buildWeaponData.mDamageMin ?? -1;
      const damageMin = calculateDamage(
        baseDamageMin,
        effect[0],
        buildWeaponData.mDamage_MWPUG_Max
      );
      const damageMinStr = baseDamageMin !== -1 ? `${damageMin} - ` : "";
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;damage per shot")}`,
        effect: `${damageMinStr}${damageMax}`,
        effectFromMax: effect[1],
        effectFromMaxActual: damageMax,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          calculateDamage(
            baseDamageMax,
            getEffect(highMidLow, ap)[0],
            buildWeaponData.mDamage_MWPUG_Max
          ),
      });
    }

    if (
      buildWeaponData.mSplashPaintRadius_MWPUG_High &&
      buildWeaponData.mSplashPaintRadius_MWPUG_Mid &&
      buildWeaponData.mSplashPaintRadius &&
      buildWeaponData.mSplashPaintRadius_MWPUG_High !==
        buildWeaponData.mSplashPaintRadius_MWPUG_Mid
    ) {
      const high = buildWeaponData.mSplashPaintRadius_MWPUG_High;
      const mid = buildWeaponData.mSplashPaintRadius_MWPUG_Mid;
      const low = buildWeaponData.mSplashPaintRadius;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;bullet ink coverage")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    const RNG_MAX = 15;

    if (
      buildWeaponData.mDegRandom_MWPUG_High &&
      buildWeaponData.mDegRandom_MWPUG_Mid &&
      buildWeaponData.mDegRandom &&
      buildWeaponData.mDegRandom_MWPUG_High !==
        buildWeaponData.mDegRandom_MWPUG_Mid
    ) {
      const high = buildWeaponData.mDegRandom_MWPUG_High;
      const mid = buildWeaponData.mDegRandom_MWPUG_Mid;
      const low = buildWeaponData.mDegRandom;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      toReturn.push({
        title: `${weaponTranslated} ${t(
          "analyzer;bullet spread (not jumping)"
        )}`,
        effect: `${parseFloat(effect[0].toFixed(2))} (${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%)`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / RNG_MAX) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLow, ap)[0].toFixed(3)),
      });
    }

    if (
      buildWeaponData.mDegJumpRandom_MWPUG_High &&
      buildWeaponData.mDegJumpRandom_MWPUG_Mid &&
      buildWeaponData.mDegJumpRandom &&
      buildWeaponData.mDegJumpRandom_MWPUG_Mid !==
        buildWeaponData.mDegJumpRandom_MWPUG_High
    ) {
      const high = buildWeaponData.mDegJumpRandom_MWPUG_High;
      const mid = buildWeaponData.mDegJumpRandom_MWPUG_Mid;
      const low = buildWeaponData.mDegJumpRandom;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      toReturn.push({
        title: `${weaponTranslated} ${t(
          "analyzer;bullet spread (in the air)"
        )}`,
        effect: `${parseFloat(effect[0].toFixed(2))} (${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%)`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / RNG_MAX) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLow, ap)[0].toFixed(3)),
      });
    }

    if (
      buildWeaponData.mInitVelRate_MWPUG_High &&
      buildWeaponData.mInitVelRate_MWPUG_Mid &&
      buildWeaponData.mInitVelRate_MWPUG_High !==
        buildWeaponData.mInitVelRate_MWPUG_Mid
    ) {
      const high = buildWeaponData.mInitVelRate_MWPUG_High;
      const mid = buildWeaponData.mInitVelRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;range and bullet velocity")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      weapon === "Luna Blaster" ||
      weapon === "Luna Blaster Neo" ||
      weapon === "Kensa Luna Blaster"
    ) {
      const high = buildWeaponData.mCollisionRadiusMiddleRate_MWPUG_High_Burst;
      const mid = buildWeaponData.mCollisionRadiusMiddleRate_MWPUG_Mid_Burst;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);

      const radius = buildWeaponData.mCollisionRadiusMiddle_Burst * effect[0];
      const totalRadius = buildWeaponData.mCollisionRadiusFar_Burst;

      toReturn.push({
        title: `${weaponTranslated} ${t(
          "analyzer;70dmg hitbox portion of the total explosion hitbox"
        )}`,
        effect: `${parseFloat(((radius / totalRadius) * 100).toFixed(2))}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (radius / totalRadius) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              ((getEffect(highMidLow, ap)[0] *
                buildWeaponData.mCollisionRadiusMiddle_Burst) /
                totalRadius) *
              100
            ).toFixed(3)
          ),
      });
    }

    if (weapon.includes("Rapid")) {
      const high = buildWeaponData.mCollisionRadiusFarRate_MWPUG_High_Burst;
      const mid = buildWeaponData.mCollisionRadiusFarRate_MWPUG_Mid_Burst;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const baseValue = buildWeaponData.mCollisionRadiusFar_Burst;
      const maxValue = buildWeaponData.mCollisionRadiusFar_MWPUG_Max_Burst;
      const effect = getEffect(highMidLow, amount);

      const value = Math.min(maxValue, effect[0] * baseValue);
      const valueAtZero = getEffect(highMidLow, 0)[0] * baseValue;
      const valueAtMax = Math.min(
        maxValue,
        getEffect(highMidLow, MAX_AP)[0] * baseValue
      );
      toReturn.push({
        title: `${weaponTranslated} ${t(
          "analyzer;bullet explosion hitbox size"
        )}`,
        effect: `${parseFloat(((value / valueAtZero) * 100).toFixed(2))}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (value / valueAtMax) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            (
              (Math.min(maxValue, getEffect(highMidLow, ap)[0] * baseValue) /
                valueAtZero) *
              100
            ).toFixed(3)
          ),
      });
    }

    if (
      buildWeaponData.mSphereSplashDropPaintRadiusRate_MWPUG_High_Burst &&
      buildWeaponData.mSphereSplashDropPaintRadiusRate_MWPUG_Mid_Burst &&
      buildWeaponData.mSphereSplashDropPaintRadiusRate_MWPUG_High_Burst !==
        buildWeaponData.mSphereSplashDropPaintRadiusRate_MWPUG_Mid_Burst
    ) {
      const high =
        buildWeaponData.mSphereSplashDropPaintRadiusRate_MWPUG_High_Burst;
      const mid =
        buildWeaponData.mSphereSplashDropPaintRadiusRate_MWPUG_Mid_Burst;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;bullet explosion paint")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      buildWeaponData.mDashSpeed_MWPUG_High &&
      buildWeaponData.mDashSpeed_MWPUG_Mid &&
      buildWeaponData.mDashSpeed &&
      buildWeaponData.mDashSpeed_MWPUG_High !==
        buildWeaponData.mDashSpeed_MWPUG_Mid
    ) {
      const high = buildWeaponData.mDashSpeed_MWPUG_High;
      const mid = buildWeaponData.mDashSpeed_MWPUG_Mid;
      const low = buildWeaponData.mDashSpeed;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t(
          "analyzer;movement speed holding trigger down"
        )}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      buildWeaponData.mCorePaintWidthHalfRate_MWPUG_High &&
      buildWeaponData.mCorePaintWidthHalfRate_MWPUG_Mid &&
      buildWeaponData.mCorePaintWidthHalfRate_MWPUG_High !==
        buildWeaponData.mCorePaintWidthHalfRate_MWPUG_Mid
    ) {
      const high = buildWeaponData.mCorePaintWidthHalfRate_MWPUG_High;
      const mid = buildWeaponData.mCorePaintWidthHalfRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;ink trail width")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      buildWeaponData.mFullChargeDistance_MWPUG_High &&
      buildWeaponData.mFullChargeDistance_MWPUG_Mid &&
      buildWeaponData.mFullChargeDistance &&
      buildWeaponData.mFullChargeDistance_MWPUG_High !==
        buildWeaponData.mFullChargeDistance_MWPUG_Mid
    ) {
      const high = buildWeaponData.mFullChargeDistance_MWPUG_High;
      const mid = buildWeaponData.mFullChargeDistance_MWPUG_Mid;
      const low = buildWeaponData.mFullChargeDistance;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;fully charged shot range")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      buildWeaponData.mSplashPaintRadiusRate_MWPUG_High &&
      buildWeaponData.mSplashPaintRadiusRate_MWPUG_Mid &&
      buildWeaponData.mSplashPaintRadiusRate_MWPUG_High !==
        buildWeaponData.mSplashPaintRadiusRate_MWPUG_Mid
    ) {
      const high = buildWeaponData.mSplashPaintRadiusRate_MWPUG_High;
      const mid = buildWeaponData.mSplashPaintRadiusRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;ink coverage")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      buildWeaponData.mFullChargeDamageRate_MWPUG_High &&
      buildWeaponData.mFullChargeDamageRate_MWPUG_Mid &&
      buildWeaponData.mFullChargeDamageRate_MWPUG_High !==
        buildWeaponData.mFullChargeDamageRate_MWPUG_Mid
    ) {
      const high = buildWeaponData.mFullChargeDamageRate_MWPUG_High;
      const mid = buildWeaponData.mFullChargeDamageRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);

      if (!weapon.includes("Bamboozler")) {
        toReturn.push({
          title: `${weaponTranslated} ${t("analyzer;damage")}`,
          effect: `${parseFloat(
            ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
          )}%`,
          effectFromMax: effect[1],
          effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
          ability: "MPU" as Ability,
          ap: amount,
          getEffect: (ap: number) =>
            parseFloat(
              ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(
                2
              )
            ),
        });
      } else {
        const damagePerShot = buildWeaponData.mFullChargeDamage;
        const maxDmg = buildWeaponData.mFullChargeDamage_MWPUG_Max;
        const damage = calculateDamage(damagePerShot, effect[0], maxDmg);
        const damageAtMax = calculateDamage(
          damagePerShot,
          effectAtMax[0],
          maxDmg
        );
        toReturn.push({
          title: `${weaponTranslated} ${t(
            "analyzer;damage per fully charged shot"
          )}`,
          effect: `${damage}`,
          effectFromMax: effect[1],
          effectFromMaxActual: (damage / damageAtMax) * 100,
          ability: "MPU" as Ability,
          ap: amount,
          getEffect: (ap: number) =>
            calculateDamage(
              damagePerShot,
              getEffect(highMidLow, ap)[0],
              maxDmg
            ),
        });
      }
    }

    if (
      buildWeaponData.mDropSplashPaintRadiusRate_MWPUG_High &&
      buildWeaponData.mDropSplashPaintRadiusRate_MWPUG_Mid &&
      buildWeaponData.mDropSplashPaintRadiusRate_MWPUG_High !==
        buildWeaponData.mDropSplashPaintRadiusRate_MWPUG_Mid
    ) {
      const high = buildWeaponData.mDropSplashPaintRadiusRate_MWPUG_High;
      const mid = buildWeaponData.mDropSplashPaintRadiusRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;ink coverage")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      buildWeaponData.mFirstGroupBulletFirstPaintRRate_MWPUG_High &&
      buildWeaponData.mFirstGroupBulletFirstPaintRRate_MWPUG_Mid &&
      buildWeaponData.mFirstGroupBulletFirstPaintRRate_MWPUG_High !==
        buildWeaponData.mFirstGroupBulletFirstPaintRRate_MWPUG_Mid
    ) {
      const high = buildWeaponData.mFirstGroupBulletFirstPaintRRate_MWPUG_High;
      const mid = buildWeaponData.mFirstGroupBulletFirstPaintRRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;ink coverage")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
        info: weapon.includes("Sloshing")
          ? t(
              "analyzer;Ink coverage bonus is only applied to the circle at the end of the shot"
            )
          : undefined,
      });
    }

    if (weapon === "Explosher" || weapon === "Custom Explosher") {
      const high = buildWeaponData.mFirstGroupSplashPaintRadiusRate_MWPUG_High;
      const mid = buildWeaponData.mFirstGroupSplashPaintRadiusRate_MWPUG_Mid;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;ink coverage")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
        info: t(
          "analyzer;Ink coverage bonus is only applied to the line before the impact"
        ),
      });
    }

    if (
      buildWeaponData.mDamageMaxMaxChargeRate_MWPUG_High_2 &&
      buildWeaponData.mDamageMaxMaxChargeRate_MWPUG_Mid_2 &&
      buildWeaponData.mDamageMaxMaxChargeRate_MWPUG_High_2 !==
        buildWeaponData.mDamageMaxMaxChargeRate_MWPUG_Mid_2
    ) {
      const high = buildWeaponData.mDamageMaxMaxChargeRate_MWPUG_High_2;
      const mid = buildWeaponData.mDamageMaxMaxChargeRate_MWPUG_Mid_2;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const baseDamageMax = buildWeaponData.mDamageMaxMaxCharge_2;
      const damageMax = calculateDamage(
        baseDamageMax,
        effect[0],
        buildWeaponData.mDamageMaxMaxCharge_MWPUG_Max_2
      );
      const baseDamageMin = buildWeaponData.mDamageMin ?? -1;
      const damageMin = calculateDamage(
        baseDamageMin,
        effect[0],
        buildWeaponData.mDamageMaxMaxCharge_MWPUG_Max_2
      );
      const damageMinStr = baseDamageMin !== -1 ? `${damageMin} - ` : "";
      toReturn.push({
        title: `${weaponTranslated} ${t(
          "analyzer;damage per shot (fully charged)"
        )}`,
        effect: `${damageMinStr}${damageMax}`,
        effectFromMax: effect[1],
        effectFromMaxActual: damageMax,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          calculateDamage(
            baseDamageMax,
            getEffect(highMidLow, ap)[0],
            buildWeaponData.mDamageMaxMaxCharge_MWPUG_Max_2
          ),
      });
    }

    if (
      buildWeaponData.mCanopyNakedFrame_MWPUG_High &&
      buildWeaponData.mCanopyNakedFrame_MWPUG_Mid &&
      buildWeaponData.mCanopyNakedFrame &&
      buildWeaponData.mCanopyNakedFrame_MWPUG_High !==
        buildWeaponData.mCanopyNakedFrame_MWPUG_Mid
    ) {
      const high = buildWeaponData.mCanopyNakedFrame_MWPUG_High;
      const mid = buildWeaponData.mCanopyNakedFrame_MWPUG_Mid;
      const low = buildWeaponData.mCanopyNakedFrame;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;shield recharge time")}`,
        effect: `${Math.ceil(effect[0])} ${t("analyzer;frames")} (${parseFloat(
          (Math.ceil(effect[0]) / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtZero[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) => Math.ceil(getEffect(highMidLow, ap)[0]),
      });
    }

    if (
      buildWeaponData.mCanopyHP_MWPUG_High &&
      buildWeaponData.mCanopyHP &&
      buildWeaponData.mCanopyNakedFrame &&
      buildWeaponData.mCanopyHP_MWPUG_High !== buildWeaponData.mCanopyHP
    ) {
      const high = buildWeaponData.mCanopyHP_MWPUG_High;
      const mid = buildWeaponData.mCanopyHP_MWPUG_Mid;
      const low = buildWeaponData.mCanopyHP;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;shield durability")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    if (
      buildWeaponData.mFirstSecondMaxChargeShootingFrameTimes_MWPUG_High_2 &&
      buildWeaponData.mFirstSecondMaxChargeShootingFrameTimes_MWPUG_Mid_2 &&
      buildWeaponData.mFirstSecondMaxChargeShootingFrameTimes_MWPUG_High_2 !==
        buildWeaponData.mFirstSecondMaxChargeShootingFrameTimes_MWPUG_Mid_2
    ) {
      const high =
        buildWeaponData.mFirstSecondMaxChargeShootingFrameTimes_MWPUG_High_2;
      const mid =
        buildWeaponData.mFirstSecondMaxChargeShootingFrameTimes_MWPUG_Mid_2;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);

      const secondCircle =
        buildWeaponData.mSecondPeriodMaxChargeShootingFrame_2;

      const total = Math.ceil(secondCircle * effect[0]);
      const maxTotal = Math.ceil(
        secondCircle * getEffect(highMidLow, MAX_AP)[0]
      );
      toReturn.push({
        title: `${weaponTranslated} ${t(
          "analyzer;full charge shooting duration"
        )}`,
        effect: `${total} ${t("analyzer;frames")} (${parseFloat(
          (total / 60).toFixed(2)
        )} ${t("analyzer;seconds")})`,
        effectFromMax: effect[1],
        effectFromMaxActual: (total / maxTotal) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          Math.ceil(secondCircle * getEffect(highMidLow, ap)[0]),
      });
    }

    if (
      weapon === "Slosher" ||
      weapon === "Slosher Deco" ||
      weapon === "Soda Slosher"
    ) {
      const high = buildWeaponData.mBulletDamageMaxDist_MWPUG_High;
      const mid = buildWeaponData.mBulletDamageMaxDist_MWPUG_Mid;
      const low = buildWeaponData.mBulletDamageMaxDist;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);

      toReturn.push({
        title: `${weaponTranslated} "mBulletDamageMaxDist"`,
        effect: `${parseFloat(effect[0].toFixed(2))}`,
        effectFromMax: effect[1],
        effectFromMaxActual: effect[1],
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLow, ap)[0].toFixed(3)),
        info: t(
          "analyzer;Slosher has weird physics so we haven't fully deciphered this parameter."
        ),
      });

      const high2 = buildWeaponData.mBulletDamageMinDist_MWPUG_High;
      const mid2 = buildWeaponData.mBulletDamageMinDist_MWPUG_Mid;
      const low2 = buildWeaponData.mBulletDamageMinDist;
      const highMidLow2 = [high2, mid2, low2];

      const effect2 = getEffect(highMidLow2, amount);

      toReturn.push({
        title: `${weaponTranslated} "mBulletDamageMinDist"`,
        effect: `${parseFloat(effect2[0].toFixed(2))}`,
        effectFromMax: effect2[1],
        effectFromMaxActual: effect2[1],
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(getEffect(highMidLow2, ap)[0].toFixed(3)),
        info: t(
          "analyzer;Slosher has weird physics so we haven't fully deciphered this parameter."
        ),
      });
    }

    if (
      buildWeaponData.mSplashDamageInsideRate_MWPUG_High_Stand &&
      buildWeaponData.mSplashDamageInsideRate_MWPUG_Mid_Stand &&
      buildWeaponData.mSplashDamageInsideRate_MWPUG_High_Stand !==
        buildWeaponData.mSplashDamageInsideRate_MWPUG_Mid_Stand
    ) {
      const high = buildWeaponData.mSplashDamageInsideRate_MWPUG_High_Stand;
      const mid = buildWeaponData.mSplashDamageInsideRate_MWPUG_Mid_Stand;
      const low = 1.0;
      const highMidLow = [high, mid, low];

      const effect = getEffect(highMidLow, amount);
      const effectAtZero = getEffect(highMidLow, 0);
      const effectAtMax = getEffect(highMidLow, MAX_AP);
      toReturn.push({
        title: `${weaponTranslated} ${t("analyzer;damage")}`,
        effect: `${parseFloat(
          ((effect[0] / effectAtZero[0]) * 100).toFixed(2)
        )}%`,
        effectFromMax: effect[1],
        effectFromMaxActual: (effect[0] / effectAtMax[0]) * 100,
        ability: "MPU" as Ability,
        ap: amount,
        getEffect: (ap: number) =>
          parseFloat(
            ((getEffect(highMidLow, ap)[0] / effectAtZero[0]) * 100).toFixed(2)
          ),
      });
    }

    return toReturn;
  }

  const abilityFunctions: Partial<Record<
    string,
    (amount: number) => Explanation[]
  >> = {
    ISM: calculateISM,
    ISS: calculateISS,
    REC: calculateREC,
    RSU: calculateRSU,
    SSU: calculateSSU,
    SCU: calculateSCU,
    SS: calculateSS,
    SPU: calculateSPU,
    QR: calculateQR,
    QSJ: calculateQSJ,
    BRU: calculateBRU,
    RES: calculateRES,
    BDU: calculateBDU,
    MPU: calculateMPU,
  } as const;

  useEffect(() => {
    if (!weapon) return;
    const AP = buildToAP({ weapon, buildsAbilities, bonusAp, lde });

    let newExplanations: Explanation[] = [];
    Object.keys(abilityFunctions).forEach((ability) => {
      const func = abilityFunctions[ability];
      const abilityForFunc = ability as Ability;
      const APcount = AP[abilityForFunc] ?? 0;
      const explanations = func!(Math.min(57, APcount));
      newExplanations = [...newExplanations, ...explanations];
    });

    setExplanations(newExplanations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(buildsAbilities), bonusAp, lde, weapon]);

  return explanations;
};

export default useAbilityEffects;
