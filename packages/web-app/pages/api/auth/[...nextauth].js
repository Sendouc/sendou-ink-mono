import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: "identify",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: async (token, _, _, profile) => {
      // no profile means it's not a sign in
      if (!profile) return Promise.resolve(token);
      const { id: discordId, avatar, username, discriminator } = profile;

      return Promise.resolve(token);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
