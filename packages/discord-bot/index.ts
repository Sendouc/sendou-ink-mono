import * as Discord from "discord.js";
import { weapons } from "@sendou-ink/shared";
const mongoose = require("mongoose");
const { Top500PlacementModel } = require("@sendou-ink/database");
require("dotenv").config({ path: "../../.env" });

mongoose.connect(process.env.MONGODB_URI, {
  dbName: "new",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const client = new Discord.Client();

client.once("ready", async () => {
  console.log("Ready! " + weapons[0]);

  const placements = await Top500PlacementModel.findTopPlayers(
    "Custom E-liter 4K"
  );

  console.log("placements", placements);
});

client.login(process.env.DISCORD_TOKEN);
