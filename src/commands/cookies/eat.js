const command = require("bananenbase").command;

module.exports = class eat extends command {
  constructor(client) {
    super(client, {
      name: "eat",
      description: "Eat some cookies!",
      category: "Cookies",
      subCommands: ["ec", "eatcookie", "eatcookies"]
    });
  }

  async run(message) {
    if (message.author.settings.last.eat && message.author.settings.last.eat > Date.now() && Math.round((message.author.settings.last.eat-Date.now())/1000/60) >= 1) return message.channel.send(`Please wait ${Math.round((message.author.settings.last.eat-Date.now())/1000/60)} minutes before eating again!`);
    if (message.author.settings.cookies < 1) return message.error(`You need at least one cookie to eat. You can search for cookies with \`${message.guild.settings.prefix}search\`.`);
    message.author.settings.cookies--;
    message.author.settings.last.eat = Date.now()+1000*60*5;
    this.client.db.set(message.author.dbId, message.author.settings);
    let msg = await message.channel.send("Eating");
    await wait(1000);
    await msg.edit("Eating.");
    await wait(1000);
    await msg.edit("Eating..");
    await wait(1000);
    await msg.edit("Eating...");
    await wait(1000);
    let amount = Math.floor(Math.random()*8)-4;
    message.author.settings.cookies += amount+1;
    if (amount === 0) amount = -1;
    if (amount === -1) msg.edit(`You got nothing, you just lost one cookie!\n> Your cookies now: ${message.author.settings.cookies}`);
    else if (amount < -1) msg.edit(`You where to hungry and you ${Math.abs(amount)-1} cookie(s) more!\n> Your cookies now: ${message.author.settings.cookies}`);
    else if (amount >= 1) msg.edit(`Someone saw that you needed more cookies and gave you ${amount} cookie(s)!\n> Your cookies now: ${message.author.settings.cookies}`);
    this.client.db.set(message.author.dbId, message.author.settings);
  }
}

function wait(time) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}