const withTM = require("next-transpile-modules")(["shared", "database"]);
const withImages = require("next-images");
require("dotenv-flow").config({ path: "../.." });

module.exports = withImages(
  withTM({
    devIndicators: {
      autoPrerender: false,
    },
    env: {
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    },
  })
);
