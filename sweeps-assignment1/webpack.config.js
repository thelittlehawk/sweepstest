const path = require("path");
const { EnvironmentPlugin } = require("webpack");

module.exports = {
  target: "webworker",
  entry: path.resolve(__dirname, "./index.js"),
  plugins: [
    new EnvironmentPlugin({
      LOCAL: false,
      DOMAIN: "google.com",
    }),
  ],
};
