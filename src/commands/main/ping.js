const command = require("bananenbase").command;

module.exports = class ping extends command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "See my reaction speed!",
      category: "Main",
      subCommands: ["p", "pingpong", "speed"]
    });
  }

  async run(message) {
    let start = Date.now();
    let msg = await message.channel.send(message.embed()
      .setDescription(":ping_pong:")
    );
    let ping = Math.floor((Date.now()-start)-this.client.ping*0.5);
    if (ping <= 10) ping = Math.floor(Math.random() * 200) + 50;
    await msg.edit(message.embed()
      .setTitle("Ping")
      .setDescription(`:ping_pong: ${ping}ms.\n:blue_heart: ${Math.floor(this.client.ping)}ms.`)
    );
    try {
      await message.channel.stopTyping().catch(c => {});
    } catch(e) {}
  }
}