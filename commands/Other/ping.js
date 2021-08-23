module.exports.help = {
  name: "ping",
  aliases: ["pg"],
  category: "Other",
  description: "Pong!",
  usage: "Ping",
  run: ({ client, message, Color }) => {
    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          description: `Pong - ${client.ws.ping}`,
          footer: { text: `- ${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
