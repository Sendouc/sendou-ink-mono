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
  callbacks: {
    session: async (_, user) => {
      return Promise.resolve(user);
    },
    jwt: async (token, user, _, profile) => {
      // no profile means callback wasn't called because of a sign in
      if (!profile) return Promise.resolve(token);

      return Promise.resolve({
        discord: { id: profile.id, avatarUrl: user.image },
      });
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
