const { Client, Collection } = require("discord.js"),
  { readdir } = require("fs");
const canvas = require("discord-canvas"),
  db = require("old-wio.db");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
});
const {
  Default_Prefix,
  Token,
  Support,
  Color,
  Welcome_Images,
  GoodBye_Images,
} = require("./config.js");
(client.commands = new Collection()), (client.aliases = new Collection());

client.on("ready", () => {
  console.log(`Bot Is Ready To Go!\nTag: ${client.user.tag}`);
  client.user.setActivity("Welcoming new members!", { type: "PLAYING" });
});

const categories = ["Config", "Other"];

for (const category of categories) {
  readdir(`./commands/${category}`, (error, files) => {
    if (error) throw error;
    for (const file of files) {
      if (!file.endsWith(".js"))
        return console.info(`${file}: does not ends with .js!`);
      const command = require(`./commands/${category}/${file}`);
      if (!command.help || !command.help.name)
        return console.info(
          `${file}: Does not have command.help or command.help.name`
        );
      client.commands.set(command.help.name, command);
      command.help.aliases
        ? command.help.aliases.forEach((alias) =>
            client.aliases.set(alias, command.help.name)
          )
        : (command.help.aliases = null);
    }
  });
}

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || message.webhookID) return;

  const prefix = (await db.fetch(`P-${message.guild.id}`)) || Default_Prefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/g),
    cmd = args.shift().toLowerCase();
  const commandFromCmd =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!commandFromCmd) return;

  try {
    commandFromCmd.help.run({
      client,
      message,
      args,
      Color,
      Default_Prefix,
      Support,
    });
  } catch (error) {
    console.log(error);
    return message.channel.send("Something went wrong, try again later");
  }
});

client.on("guildMemberAdd", async (member) => {
  const welcomeChannel = await db.fetch(`WC-${member.guild.id}`);
  if (!welcomeChannel) return;
  const welcomeMessage = (
    (await db.fetch(`WM-${member.guild.id}`)) ||
    `${member.user.username} Has Joined The Server!`
  )
    .replace(/<servername>/g, member.guild.name)
    .replace(/<membername>/g, member.user.username)
    .replace(/<membermention>/g, `<@${member.user.id}>`);

  if (member.user.username.length > 25)
    member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15)
    member.guild.name = member.guild.name.slice(0, 15) + "...";

  const welcomeImageAttachment = await new canvas.Welcome()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
    .setMemberCount(member.guild.memberCount)
    .setBackground(
      Array.isArray(Welcome_Images)
        ? Welcome_Images[Math.floor(Math.random() * Welcome_Images.length)]
        : Welcome_Images ||
            "https://images.wallpaperscraft.com/image/landscape_art_road_127350_1280x720.jpg"
    )
    .toAttachment();

  return client.channels.cache.get(welcomeChannel).send({
    content: welcomeMessage,
    files: [
      {
        attachment: welcomeImageAttachment.toBuffer(),
        name: "Welcome.png",
      },
    ],
  });
});

client.on("guildMemberRemove", async (member) => {
  const goodbyeChannel = await db.fetch(`GC-${member.guild.id}`);
  if (!goodbyeChannel) return;
  const goodbyeMessage = (
    (await db.fetch(`GM-${member.guild.id}`)) ||
    `${member.user.username} Has Left The Server!`
  )
    .replace(/<servername>/g, member.guild.name)
    .replace(/<membername>/g, member.user.username)
    .replace(/<membermention>/g, `<@${member.user.id}>`);

  if (member.user.username.length > 25)
    member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15)
    member.guild.name = member.guild.name.slice(0, 15) + "...";

  const goodbyeImageAttachment = await new canvas.Goodbye()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
    .setMemberCount(member.guild.memberCount)
    .setBackground(
      Array.isArray(GoodBye_Images)
        ? GoodBye_Images[Math.floor(Math.random() * GoodBye_Images.length)]
        : GoodBye_Images ||
            "https://images.wallpaperscraft.com/image/cat_night_lights_74375_1280x720.jpg"
    )
    .toAttachment();

  return client.channels.cache.get(goodbyeChannel).send({
    content: goodbyeMessage,
    files: [
      {
        attachment: goodbyeImageAttachment.toBuffer(),
        name: "Goodbye.png",
      },
    ],
  });
});

client
  .login(Token)
  .catch(() =>
    console.log(
      `Probably an invalid bot token is provided, please check your bot token.`
    )
  );
