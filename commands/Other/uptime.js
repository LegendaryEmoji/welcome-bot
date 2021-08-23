module.exports.help = {
  name: "uptime",
  aliases: ["upt"],
  category: "Other",
  description: "Get bot running time",
  usage: "Uptime",
  run: ({ client, message, Color }) => {
    function getUptime(days, hours, minutes, seconds) {
      if (days > 0) return `${days}d:${hours}h:${minutes}m:${seconds}s`;
      if (hours > 0) return `${hours}h:${minutes}m:${seconds}s`;
      if (minutes > 0) return `${minutes}m:${seconds}s`;
      return `${seconds}s`;
    }

    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          description: getUptime(
            Math.floor(client.uptime / 86400000),
            Math.floor(client.uptime / 3600000) % 24,
            Math.floor(client.uptime / 60000) % 60,
            Math.floor(client.uptime / 1000) % 60
          ),
          footer: { text: `- ${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
