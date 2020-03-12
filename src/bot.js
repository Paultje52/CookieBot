const BananenBase = require("bananenbase");

new BananenBase({
  token: "TOKEN",
  database: {
    package: "keyv",
    type: "sqlite",
    code: `${__dirname}/database.sqlite`
  },
  botConfig: require("./config.js"),
  ignore: {
    bot: true,
    pm: true
  }
});