import { BotCommand } from "..";
import ids from "../utils/ids";
import roleManagerIdMap from "../utils/roleManagerIdMap";

const addRoleCommand: BotCommand = {
  name: "add",
  description: "Gives you the specified role",
  validGuilds: [ids.guilds.sro],
  execute: async (msg, args) => {
    if (!args.length) return;

    const roleMap = roleManagerIdMap[msg.guild?.id ?? ""];
    if (!roleMap) return;

    const roleWanted = args[0];

    const isValidRole = (role: string): role is keyof typeof roleMap => {
      return roleMap.hasOwnProperty(role);
    };

    if (!isValidRole(roleWanted)) return;

    const member = msg.member!;
    const roleId = roleMap[roleWanted];
    if (member.roles.cache.some((role) => role.id === roleId)) {
      await msg.channel.send(
        `You already have the role, ${member.user.username}`
      );
      return;
    }

    await member.roles.add(roleId);
    await msg.react("✅");
  },
};

export default addRoleCommand;
