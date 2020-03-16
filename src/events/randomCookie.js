const event = require("bananenbase").event;

module.exports = class randomCookie extends event {
  constructor(client) {
    super(client, {
      name: "message"
    });
  }

  run(...args) {
    setTimeout(() => {
      this.execute(...args);
    }, 1000);
  }
  
  execute(message) {
    let chance = Math.floor(Math.random()*20);
    if (chance === 0) { // 5% chance
      let amount = Math.floor(Math.random()*3)+2; // 2 - 5 cookies
      message.channel.send(message.embed()
        .setTitle("🎉")
        .setDescription(`You got ${amount} cookies because you're lucky!`)
      );
      message.author.settings.cookies += amount;
      this.client.db.set(message.author.dbId, message.author.settings);
    }
  }
}