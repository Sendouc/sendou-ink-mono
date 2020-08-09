import * as mongoose from "mongoose";
import { Weapon, RankedMode } from "@sendou-ink/shared";

const Top500PlacementSchema = new mongoose.Schema({
  name: String,
  weapon: String,
  rank: Number,
  mode: String,
  xPower: Number,
  uniqueId: String,
  month: Number,
  year: Number,
});

interface ITop500Placement extends mongoose.Document {
  name: string;
  weapon: Weapon;
  rank: number;
  mode: RankedMode;
  xPower: number;
  uniqueId: string;
  month: number;
  year: number;
}

Top500PlacementSchema.statics.findTopPlayers = async function (weapon: Weapon) {
  return this.aggregate([
    { $match: { weapon } },
    {
      $group: {
        _id: "$uniqueId",
        allNames: { $addToSet: "$name" },
        xPower: { $max: "$xPower" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        xPower: -1,
      },
    },
    {
      $limit: 100,
    },
  ]);
};

export interface XRankTopPlayer {
  _id: string;
  allNames: string[];
  xPower: number;
  count: number;
}

interface ITop500PlacementModel extends mongoose.Model<ITop500Placement> {
  findTopPlayers(weapon: Weapon): Promise<XRankTopPlayer[]>;
}

export const Top500PlacementModel = mongoose.model<
  ITop500Placement,
  ITop500PlacementModel
>("Top500Placement", Top500PlacementSchema);
