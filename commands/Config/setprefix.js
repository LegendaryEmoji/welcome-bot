const db = require("old-wio.db");

module.exports.help = {
  name: "setprefix",
  aliases: ["newprefix", "sp"],
  category: "Config",
  description: "Set The Prefix Of Bot!",
  usage: "Setprefix <New Prefix>",
  run: async ({ message, args, Color, Default_Prefix }) => {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.channel.send(
        "You Don't Have Enough Permission To Execute This Command - Manage Server"
      );

    const Prefix = (await db.fetch(`P-${message.guild.id}`)) || Default_Prefix;

    if (!args[0])
      return message.channel.send("Please Give The New Prefix Of The Bot!");

    if (args[0].length > 6)
      return message.channel.send("Too Long Prefix - 6 Limit");

    if (args[0] === Prefix)
      return message.channel.send("Given Prefix Is The Current Prefix!");

    await db.set(`P-${message.guild.id}`, args[0]);

    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          title: "Success",
          description: `New Prefix Has Been Set - ${args[0]}`,
          footer: { text: `- ${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
