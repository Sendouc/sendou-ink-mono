const ids = {
  roles: {
    sroLfg: process.env.SRO_LFG_ROLE_ID!,
  },
  channels: {
    sroBot: process.env.SRO_BOT_CHANNEL_ID!,
    sroLfg: process.env.SRO_LFG_CHANNEL_ID!,
  },
  guilds: {
    sro: process.env.SRO_GUILD_ID!,
  },
} as const;

export default ids;
