import ids from "./ids";

const roleManagerIdMap = {
  [ids.guilds.sro]: {
    lfg: ids.roles.sroLfg,
  },
} as const;

export default roleManagerIdMap;
