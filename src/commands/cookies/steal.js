const command = require("bananenbase").command;

module.exports = class steal extends command {
  constructor(client) {
    super(client, {
      name: "steal",
      description: "Steal cookies!",
      category: "Cookies",
      subCommands: ["stealcookies", "steelcookie", "sc"],
      args: ["@member:required"]
    });
  }

  async run(message, args) {
    if (message.author.settings.last.steal && message.author.settings.last.steal > Date.now() && Math.round((message.author.settings.last.steal-Date.now())/1000/60) >= 1) return message.channel.send(`Please wait ${Math.round((message.author.settings.last.steal-Date.now())/1000/60)} minutes before stealing again!`);
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.error(`Invalid use of the command! Use \`${message.guild.settings.prefix}steal <@member>\``);
    if (!member.user.settings) member.user.settings = await this.client.db.get(`author-${member.id}`);
    if (!member.user.settings) member.user.settings = this.client.config.authorSettings;
    message.author.settings.last.steal = Date.now()+1000*60*30;
    this.client.db.set(message.author.dbId, message.author.settings);
    this.howMuch(message, member);    
  }

  async howMuch(message, member) {
    let msg = await message.channel.send(`How much cookies do you want to steal? If you try more, there is a higher change that you will be caught!\n> Your cookies now: ${message.author.settings.cookies}\n> ${member.user.username}'s cookies now: ${member.user.settings.cookies}\n**Provide a number between 1 and 10!** ${member.user.username} and you both need to have at least that amount of cookies!`);
    const collector = message.channel.createMessageCollector((m) => {
      return !isNaN(Number(m.content)) && m.author.id === message.author.id;
    }, { time: 15000 });

    collector.on("collect", () => {
      collector.stop();
    })

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        message.author.settings.last.steal = Date.now();
        this.client.db.set(message.author.dbId, message.author.settings);
        msg.delete();
        return message.channel.send("You didn't give up anything, canceled!");
      }
      let amount = Number(collected.array()[0].content);
      if (amount < 1 || amount > 10) return message.error("You can only pick a number between 1 and 10!");
      if (message.author.settings.cookies < amount) return message.error(`You don't have ${amount} cookies!`);
      if (member.user.settings.cookies < amount) return message.error(`${member.user.username} doesn't have ${amount} cookies!`);
      msg = await message.channel.send("Stealing");
      await wait(1000);
      await msg.edit("Stealing.");
      await wait(1000);
      await msg.edit("Stealing..");
      await wait(1000);
      await msg.edit("Stealing...");
      await wait(1000);
      let change = Math.round(Math.random()*40)+amount*Math.random()*10;
      if (change > 40) {
        if (Math.round(Math.random()) === 0) {
          message.author.settings.cookies -= amount;
          member.user.settings.cookies += amount;
          this.client.db.set(message.author.dbId, message.author.settings);
          this.client.db.set(`author-${member.id}`, member.user.settings);
          msg.edit(message.embed()
            .setTitle("Caught!")
            .setDescription(`You got caught by ${member.user.username}! That means that you payed ${amount} cookies to ${member.user.username}!\n> Your cookies now: ${message.author.settings.cookies}`)
          );
        } else {
          message.author.settings.cookies -= amount;
          this.client.db.set(message.author.dbId, message.author.settings);
          msg.edit(message.embed()
            .setTitle("Caught!")
            .setDescription(`You got caught by the police! That means that you lost ${amount} cookies!\n> Your cookies now: ${message.author.settings.cookies}`)
          );
        }
      } else {
        message.author.settings.cookies += amount;
        member.user.settings.cookies -= amount;
        this.client.db.set(message.author.dbId, message.author.settings);
        this.client.db.set(`author-${member.id}`, member.user.settings);
        msg.edit(message.embed()
          .setTitle("Did it!")
          .setDescription(`You stole ${amount} cookies from ${member.user.username}!\n> Your cookies now: ${message.author.settings.cookies}`)
        );
      }
    });
  }
}

function wait(time) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}