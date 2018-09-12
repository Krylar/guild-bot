exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);
  if(args.length != 1) {
    message.channel.send("Error: missing arguments", {code:"asciidoc"});
    return;
  }



  dRole = message.guild.roles.findAll("name", args[0])

//  if(dRole.size > 0) {
    dRole.forEach(function(arg) {
      message.channel.send(`Deleting role ${arg.name}`, {code:"asciidoc"});
      console.log("Deleting role...");
      arg.delete()
  //    .then(console.log)
        .catch(console.error);
    });
//  } else {
//    message.channel.send(`No roles found.`, {code:"asciidoc"});
//  };

//    });


  let dChannel = message.guild.channels.findAll("name", args[0]);

//  if(dChannel.size > 0) {
    dChannel.forEach(function(arg) {
      message.channel.send(`Deleting channel ${arg.name}`, {code:"asciidoc"});
      console.log("Deleting channel...");
      arg.delete()
//      .then(console.log)
        .catch(console.error);
    });
//  } else {
//    message.channel.send(`No channels found.`, {code:"asciidoc"});
//  };



  message.channel.send("Wipe complete!", {code:"asciidoc"});

  //message.channel.send(`placeholder: merged ${args.filter(function(arg) { arg.index > 0})} into ${tgtRole}`);



};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "wipe",
  category: "Merge administration",
  description: "Delete role & channel for server",
  usage: "wipe <server #>"
};
