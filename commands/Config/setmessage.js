const { Default_Prefix, Color } = require("../../config.js");
const Discord = require("discord.js");
const db = require("old-wio.db");

module.exports = {
  name: "setmessage",
  aliases: ["setmsg", "sm"],
  category: "Config",
  description: "Set The Welcome Or Leave Message When Someone Joins Or Leave!",
  usage: "Setmessage <Type> <Message>",
  run: async (client, message, args) => {
    
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You Don't Have Enough Permission To Execute This Command - Manage Messages");
    
    let Type = args[0];
    let Welcome = ["welcome", "wel", "join"];
    let leave = ["leave", "left"];
    let Types = [];
    Welcome.forEach(wel => Types.push(wel));
    leave.forEach(leav => Types.push(leav));
    
    if (!Type || !Types.find(T => T === Type.toLowerCase())) return message.channel.send(`Please Give A Valid Type - Welcome, Wel, Join, Leave, Left`);
    
    Type = Type.toLowerCase();
    
    let Msg = args.slice(1).join(" ");
    
    if (!Msg) return message.channel.send(`Please Give Message\n\nCustom:\n<ServerName> => Server Name\n<MemberName> => Member Name\n<MemberMention> => Member Mention`);
    
    if (Msg.length > 1000) return message.channel.send(`Too Long Message - Limit 1000`);
    
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
    .setDescription(`${Current === "Welcome" ? "Welcome" : "Leave"} Message Has Been Setted -\n${Msg}`)
    .setFooter(`Setted By ${message.author.username}`)
    .setTimestamp();

    await db.set(`${Current === "Welcome" ? "Welcome" : "Leave"}_${message.guild.id}_Msg`, Msg);

    try {
        return message.channel.send(Embed);
    } catch (error) {
        return message.channel.send(`${Current === "Welcome" ? "Welcome" : "Leave"} Message Has Been Setted -\n${Msg}`);
    };

  }
};
