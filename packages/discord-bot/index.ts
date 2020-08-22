import * as Discord from "discord.js";
import { weapons } from "@sendou-ink/shared";
const mongoose = require("mongoose");
require("dotenv").config({ path: "../../.env" });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const client = new Discord.Client();

client.once("ready", async () => {
  console.log("Ready! ");
});

client.login(process.env.DISCORD_BOT_TOKEN);
