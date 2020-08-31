import * as Discord from "discord.js";
import ids from "./utils/ids";

const onNewMessage = (msg: Discord.Message) => {
  switch (msg.channel.id) {
    case ids.channels.sroLfg:
      return () => {
        if (!msg.cleanContent.startsWith("@")) msg.delete();
      };
    default:
      return null;
  }
};

export default onNewMessage;
