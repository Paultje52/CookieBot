const command = require("bananenbase").command;

module.exports = class about extends command {
  constructor(client) {
    super(client, {
      name: "about",
      description: "Where am I from?",
      category: "Main"
    });
  }

  async run(message) {
    message.channel.send(message.embed()
      .setTitle("Hello there!")
      .setDescription(`I'm CookieBot, a Discord Bot writen in NodeJS with the [BananenBase](https://npmjs.com/bananenbase).\nDo you know what the cool thing is? I'm opensource! You can view my code [here](https://github.com/paultje52/cookiebot).`)
      .setFooter("©Paultje")
    );
  }
}