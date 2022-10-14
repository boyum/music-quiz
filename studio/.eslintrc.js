const path = require("path");

module.exports = {
  extends: ["standard", "prettier"],
  parser: "babel-eslint",
  settings: {
    react: {
      pragma: "React",
      version: "17.0.2",
    },
  },
};
