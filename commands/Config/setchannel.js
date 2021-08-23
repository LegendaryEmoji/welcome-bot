const db = require("old-wio.db");

module.exports.help = {
  name: "setchannel",
  aliases: ["setch", "sc"],
  category: "Config",
  description: "Set The Welcome Or Goodbye Message Channel!",
  usage: "Setchannel <Mention Channel> <Type>",
  run: async ({ message, args, Color }) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message.channel.send(
        "You Don't Have Enough Permission To Execute This Command - Manage Channels"
      );

    const mentionedChannel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!mentionedChannel || mentionedChannel.type === "voice")
      return message.channel.send(`Please Give A Valid Text Channel!`);

    const Welcome = ["welcome", "wel", "join"],
      Goodbye = ["goodbye", "leave", "left"];

    if (
      !args[1] ||
      ![...Welcome, ...Goodbye].find((T) => T === args[1].toLowerCase())
    )
      return message.channel.send(
        `Please Give A Valid Type - ${[...Welcome, Goodbye].join(", ")}`
      );

    const Current = Welcome.some((wel) => wel === args[1].toLowerCase())
      ? "Welcome"
      : "Goodbye";

    await db.set(
      `${Current === "Welcome" ? `WC` : `GC`}-${message.guild.id}`,
      mentionedChannel.id
    );

    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          title: "Success",
          description: `${Current} Channel Has Been Set - <#${mentionedChannel.id}>`,
          footer: { text: `- ${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
