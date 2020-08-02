import * as mongoose from "mongoose";
import { Weapon, RankedMode } from "@sendou-ink/shared";

export interface ITop500Placement {
  name: string;
  weapon: Weapon;
  rank: number;
  mode: RankedMode;
  xPower: number;
  uniqueId: string;
  month: number;
  year: number;
}

const top500PlacementSchema = new mongoose.Schema({
  name: String,
  weapon: String,
  rank: Number,
  mode: String,
  xPower: Number,
  uniqueId: String,
  month: Number,
  year: Number,
});

export const Top500PlacementModel = mongoose.model<
  ITop500Placement & mongoose.Document
>("Top500Placement", top500PlacementSchema);
