import * as Discord from "discord.js";
import { weapons } from "@sendou-ink/shared";

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready! " + weapons[0]);
});

client.login("token here");
