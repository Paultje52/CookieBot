const command = require("bananenbase").command;

module.exports = class search extends command {
  constructor(client) {
    super(client, {
      name: "search",
      description: "Search for cookies!",
      category: "Cookies",
      subCommands: ["sc", "searchcookie", "searchcookies"]
    });
  }

  async run(message) {
    if (message.author.settings.last.search && message.author.settings.last.search > Date.now() && Math.round((message.author.settings.last.search-Date.now())/1000/60) >= 1) return message.channel.send(`Please wait ${Math.round((message.author.settings.last.search-Date.now())/1000/60)} minutes before searching again!`);
    message.author.settings.last.search = Date.now()+1000*60*60;
    this.client.db.set(message.author.dbId, message.author.settings);
    let msg = await message.channel.send("Sarching");
    await wait(1000);
    await msg.edit("Sarching.");
    await wait(1000);
    await msg.edit("Sarching..");
    await wait(1000);
    await msg.edit("Sarching...");
    await wait(1000);
    let amount = Math.floor(Math.random()*5);
    message.author.settings.cookies += amount;
    if (amount === 0) msg.edit(`You didn't find anything, try again later!\n> Your cookies now: ${message.author.settings.cookies}`);
    else if (amount === 1) msg.edit(`You found one cookie!\n> Your cookies now: ${message.author.settings.cookies}`);
    else msg.edit(`You found ${amount} cookies!\n> Your cookies now: ${message.author.settings.cookies}`);
    this.client.db.set(message.author.dbId, message.author.settings);
  }
}

function wait(time) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}