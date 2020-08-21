import * as mongoose from "mongoose";
import {
  weapons,
  Weapon,
  StackableAbility,
  HeadOnlyAbility,
  ClothingOnlyAbility,
  ShoesOnlyAbility,
  HeadGear,
  ClothingGear,
  ShoesGear,
} from "@sendou-ink/shared";
import {
  headOnlyAbilities,
  stackableAbilities,
  clothingOnlyAbilities,
  shoesOnlyAbilities,
} from "@sendou-ink/shared/constants/abilities";
import { shoesGears } from "@sendou-ink/shared/constants/shoesGears";
import { clothingGears } from "@sendou-ink/shared/constants/clothingGears";
import { headGears } from "@sendou-ink/shared/constants/headGears";
import { IUser } from "./user";

const BuildSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weapon: { type: String, required: true, enum: weapons },
    title: { type: String, maxlength: 100, trim: true },
    description: { type: String, maxlength: 1000, trim: true },
    headAbilities: {
      type: [String],
      required: true,
      validate: {
        validator: (abilities: any[]) => {
          if (abilities.length !== 4) return false;
          for (const [index, item] of abilities.entries()) {
            if (index === 0 && headOnlyAbilities.includes(item)) continue;

            if (!stackableAbilities.includes(item)) return false;
          }

          return true;
        },
        message: (props: any) => `Invalid head abilities: ${props.value}`,
      },
    },
    headGear: { type: String, enum: headGears },
    clothingAbilities: {
      type: [String],
      required: true,
      validate: {
        validator: (abilities: any[]) => {
          if (abilities.length !== 4) return false;
          for (const [index, item] of abilities.entries()) {
            if (index === 0 && clothingOnlyAbilities.includes(item)) continue;

            if (!stackableAbilities.includes(item)) return false;
          }

          return true;
        },
        message: (props: any) => `Invalid clothing abilities: ${props.value}`,
      },
    },
    clothingGear: { type: String, enum: clothingGears },
    shoesAbilities: {
      type: [String],
      required: true,
      validate: {
        validator: (abilities: any[]) => {
          if (abilities.length !== 4) return false;
          for (const [index, item] of abilities.entries()) {
            if (index === 0 && shoesOnlyAbilities.includes(item)) continue;

            if (!stackableAbilities.includes(item)) return false;
          }

          return true;
        },
        message: (props: any) => `Invalid shoes abilities: ${props.value}`,
      },
    },
    shoesGear: { type: String, enum: shoesGears },
    top500: { type: Boolean, default: false },
    jpn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

interface IBuildSchema extends mongoose.Document {
  weapon: Weapon;
  title?: string;
  description?: string;
  headAbilities: [
    HeadOnlyAbility | StackableAbility,
    StackableAbility,
    StackableAbility,
    StackableAbility
  ];
  headGear?: HeadGear;
  clothingAbilities: [
    ClothingOnlyAbility | StackableAbility,
    StackableAbility,
    StackableAbility,
    StackableAbility
  ];
  clothingGear?: ClothingGear;
  shoesAbilities: [
    ShoesOnlyAbility | StackableAbility,
    StackableAbility,
    StackableAbility,
    StackableAbility
  ];
  shoesGear?: ShoesGear;
  top500: boolean;
  jpn: boolean;
}

export interface IBuild extends IBuildSchema {
  author: IUser["_id"];
}

export interface IBuild_populated extends IBuildSchema {
  author: IUser;
}

export const BuildModel =
  <mongoose.Model<IBuild, {}>>mongoose.models.Build ??
  mongoose.model<IBuild, mongoose.Model<IBuild>>("Build", BuildSchema);
