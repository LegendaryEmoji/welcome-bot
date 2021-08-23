const db = require("old-wio.db");

module.exports.help = {
  name: "setmessage",
  aliases: ["setmsg", "sm"],
  category: "Config",
  description: "Set The Welcome Or Leave Message When Someone Joins Or Leave!",
  usage: "Setmessage <Type> <Message>",
  run: async ({ message, args, Color }) => {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.channel.send(
        "You Don't Have Enough Permission To Execute This Command - Manage Messages"
      );

    const Welcome = ["welcome", "wel", "join"],
      Goodbye = ["goodbye", "leave", "left"];

    if (
      !args[0] ||
      ![...Welcome, ...Goodbye].find((T) => T === args[0].toLowerCase())
    )
      return message.channel.send(
        `Please Give A Valid Type - ${[...Welcome, ...Goodbye].join(", ")}`
      );

    const messageRaw = args.slice(1).join(" ");

    if (!messageRaw)
      return message.channel.send(
        `Please Give Message\n\nCustom:\n<servername> => Server Name\n<membermame> => Member Name\n<membermention> => Member Mention`
      );

    if (messageRaw.length > 1000)
      return message.channel.send("Too Long Message - Limit 1000");

    const Current = Welcome.some((wel) => wel === args[0])
      ? "Welcome"
      : "Goodbye";

    await db.set(
      `${Current === "Welcome" ? "WM" : "GM"}-${message.guild.id}`,
      messageRaw
    );

    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          title: "Success",
          description: `${Current} Message Has Been Set -\n${messageRaw}`,
          footer: { text: `- ${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
