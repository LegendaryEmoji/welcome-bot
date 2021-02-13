const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("old-wio.db");

module.exports = {
  name: "setchannel",
  aliases: ["setch", "sc"],
  category: "Config",
  description: "Set The Welcome Or Leave Message Channel!",
  usage: "Setchannel <Mention Channel> <Type>",
  run: async (client, message, args) => {
    
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("You Don't Have Enough Permission To Execute This Command - Manage Channels");
    
    let Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    
    if (!Channel || Channel.type === "voice") return message.channel.send(`Please Give A Valid Text Channel!`);
    
    let Type = args[1];
    let Welcome = ["welcome", "wel", "join"];
    let leave = ["leave", "left"];
    let Types = [];
    Welcome.forEach(wel => Types.push(wel));
    leave.forEach(leav => Types.push(leav));
    
    if (!Type || !Types.find(T => T === Type.toLowerCase())) return message.channel.send(`Please Give A Valid Type - Welcome, Wel, Join, Leave, Left`);
    
    Type = Type.toLowerCase();
        
    async function GetType(Type) {
      if (Welcome.find(W => W === Type)) {
        return "Welcome";
      } else {
        return "Leave";
      };
    };
    
    let Current = await GetType(Type);
    
    const Embed = new Discord.MessageEmbed()
    .setColor(Color || "RANDOM")
    .setTitle(`Sucess`)
    .setDescription(`${Current === "Welcome" ? "Welcome" : "Leave"} Channel Has Been Setted - <#${Channel.id}>`)
    .setFooter(`Setted By ${message.author.username}`)
    .setTimestamp();

    await db.set(`${Current === "Welcome" ? "Welcome" : "Leave"}_${message.guild.id}_Channel`, Channel.id);

    try {
        return message.channel.send(Embed);
    } catch (error) {
        return message.channel.send(`${Current === "Welcome" ? "Welcome" : "Leave"} Message Has Been Setted - <#${Channel}>`);
    };

  }
};
