const withTM = require("next-transpile-modules")(["shared", "database"]);
const withImages = require("next-images");
require("dotenv").config({ path: "../../.env" });

module.exports = withImages(
  withTM({
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    },
  })
);
