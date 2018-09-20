const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;

  if(message.guild.name!="Theorycrafters DEV") {
    message.reply("Command disabled outside of dev server!");
    return;
  }

  if(args.length < 1) {
    message.channel.send("Error: missing arguments");
    return;
  }

  gTag = args[0].toUpperCase();

  // delete channels/categories that exist
  chans = ["","-chat","-galactic","-galactic-voice","-command","-officer"];
  chans.forEach(c => {
    if(c=="") chName = gTag;
    else chName = gTag.toLowerCase() + c;
//    message.reply(`searching for channel ${chName}`);
    if(cat = message.guild.channels.find(ch => ch.name == chName)) {
//      message.reply(`found channel ${cat.name}. deleting...`);
      cat.delete();
    }
  });

  // check if roles already exist
  guildRolesSuffixes = [" Command", " Officer", ""];
  guildRolesSuffixes.forEach(r => {
    roleName = gTag + r;
    dr = message.guild.roles.find(m => m.name.toLowerCase() === roleName.toLowerCase());
    if(dr) {
      dr.delete();
    }
  });

    message.channel.send(`Roles and channels for ${gTag} have been deleted!`, {code:"asciidoc"});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["delete","del","rm","remove"],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "drop",
  category: "Guild Administration",
  description: "delete guild channels & roles",
  usage: "drop <tag>"
};
