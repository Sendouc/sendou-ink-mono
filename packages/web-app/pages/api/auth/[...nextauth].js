import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { UserModel } from "@sendou-ink/database";
import dbConnect from "utils/dbConnect";

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

      await dbConnect();

      const userFromDb = await UserModel.findOneAndUpdate(
        { "discord.id": profile.id },
        { discord: profile },
        { upsert: true, new: true }
      );

      return Promise.resolve({
        _id: userFromDb._id,
        discord: { id: profile.id, avatarUrl: user.image },
      });
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
