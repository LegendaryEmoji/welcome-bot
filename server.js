const Discord = require("discord.js");
const fs = require("fs");
const db = require("old-wio.db");
const canvas = require("discord-canvas");
const client = new Discord.Client();
const { Default_Prefix, Token, Color, Support, Owner, WelcomeImage, LeaveImage } = require("./config.js");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on("ready", async () => {
  console.log(`Bot Is Ready To Go!\nTag: ${client.user.tag}`);
  client.user.setActivity(`New Members!`, { type: "WATCHING" });
});

let modules = ["Config", "Other"];

modules.forEach(function(module) {
  fs.readdir(`./commands/${module}`, function(error, files) {
    if (error) return new Error(`${error}`);
    files.forEach(function(file) {
      if (!file.endsWith(".js"))
        throw new Error(`A File Does Not End With .js!`);
      let command = require(`./commands/${module}/${file}`);
      console.log(`${command.name} Has Been Loaded - ✅`);
      if (command.name) client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias =>
          client.aliases.set(alias, command.name)
        );
      }
      if (command.aliases.length === 0) command.aliases = null;
    });
  });
});

client.on("message", async message => {
  if (message.author.bot || !message.guild || message.webhookID) return;

  let Prefix = await db.fetch(`Prefix_${message.guild.id}`);
  if (!Prefix) Prefix = Default_Prefix;

  if (!message.content.startsWith(Prefix)) return;

  let args = message.content
    .slice(Prefix.length)
    .trim()
    .split(/ +/g);
  let cmd = args.shift().toLowerCase();

  let command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!command)
    return message.channel.send(
      `No Command Found - ${cmd.charAt(0).toUpperCase() + cmd.slice(1)}`
    );

  try {
    if (command) {
      command.run(client, message, args);
    }
  } catch (error) {
    return message.channel.send(`Something Went Wrong, Try Again Later!`);
  }
});

client.on("guildMemberAdd", async member => {
  let Channel = await db.fetch(`Welcome_${member.guild.id}_Channel`);
  if (!Channel) return;
  let Message = await db.fetch(`Welcome_${member.guild.id}_Msg`);
  if (!Message) Message = `Welcome To The Server!`;
  
  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let Msg = Message.toLowerCase().replace("<servername>", member.guild.name).replace("<membername>", member.user.username).replace("<membermention>", `<@${member.user.id}>`);
  let Welcomed = new canvas.Welcome();
  let Image = await Welcomed
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(WelcomeImage || "https://images.wallpaperscraft.com/image/landscape_art_road_127350_1280x720.jpg")
  .toAttachment();
  
  let Attachment = new Discord.MessageAttachment(Image.toBuffer(), "Welcome.png");
  return client.channels.cache.get(Channel).send(Msg, Attachment);
});

client.on("guildMemberRemove", async member => {
  let Channel = await db.fetch(`Leave_${member.guild.id}_Channel`);
  if (!Channel) return;
  let Message = await db.fetch(`Leave_${member.guild.id}_Msg`);
  if (!Message) Message = `${member.user.username} Has Left The Server!`;
  
  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let Msg = Message.toLowerCase().replace("<servername>", member.guild.name).replace("<membername>", member.user.username).replace("<membermention>", `<@${member.user.id}>`);
  let Leaved = new canvas.Goodbye();
  let Image = await Leaved
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(LeaveImage || "https://images.wallpaperscraft.com/image/cat_night_lights_74375_1280x720.jpg")
  .toAttachment();
  
  let Attachment = new Discord.MessageAttachment(Image.toBuffer(), "Welcome.png");
  return client.channels.cache.get(Channel).send(Msg, Attachment);
});

client.login(Token).catch(() => console.log(`Invalid Token Is Provided - Please Give Valid Token!`));
