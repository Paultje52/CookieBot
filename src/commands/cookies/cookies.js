const command = require("bananenbase").command;

module.exports = class cookies extends command {
  constructor(client) {
    super(client, {
      name: "cookies",
      description: "See your cookies!",
      category: "Cookies",
      subCommands: ["c"],
      args: ["@member:optional"]
    });
  }

  async run(message, args) {
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) {
      message.channel.send(message.embed()
        .setTitle("Your cookies")
        .setDescription(`You currently have ${message.author.settings.cookies} cookies!`)
      );
    } else {
      if (!member.user.settings) member.user.settings = await this.client.db.get(`author-${member.id}`);
      if (!member.user.settings) member.user.settings = this.client.config.authorSettings;
      message.channel.send(message.embed()
        .setTitle(`Cookies of ${member.user.username}`)
        .setDescription(`${member.user.username} has ${member.user.settings.cookies} cookies!!`)
      );
    }
  }
}