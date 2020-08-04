const withTM = require("next-transpile-modules")(["shared"]);
const withImages = require("next-images");

module.exports = withImages(withTM());
