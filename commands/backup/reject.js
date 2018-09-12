exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);
//  let ndx = args.findIndex(function(element) {return element === "debug"});
//  message.channel.send(`Debug? ${ndx}`);
//  if(ndx >>> 0) {
//    args.splice(ndx, 1);
//  }

//message.channel.send("args[0]: " + args[0]);
//message.channel.send("args[1]: " + args[1]);
  if(args.length < 2) {
    message.channel.send("Error: missing arguments");
    return;
  }
  tag = args[0].toUpperCase();
  username = args[1];

  // ********** SETUP **********
  // get server
  let g = message.guild;
  if(debug) message.channel.send(`Server:: ${message.guild.name}`, {code:"asciidoc"});

  // check if role args[0] exists
//  role = g.roles.find("name", tag);
  role = g.roles.find(val => val.name.toLowerCase() === tag.toLowerCase());
  if(!role) {
    message.channel.send(`Error: role ${tag} does not exist`, {code:"asciidoc"});
    return;
  }

  // get officer role for tag
//  officerRole = g.roles.find("name", tag + " Officer");
  officerRole = g.roles.find(val => val.name.toLowerCase() === tag.toLowerCase() + " officer");
  if(!officerRole) {
    message.channel.send(`Error: Officer role does not exist for ${role.name}!`, {code:"asciidoc"});
    return;
  }

  // is author in officer role?
  if(! officerRole.members.find("id", message.author.id)) {
    message.channel.send(`Error: You do not have the ${officerRole.name} role!`, {code:"asciidoc"});
    return;
  }

  // get target user name
//  user = role.members.find("displayName", username);
  user = role.members.find(val => val.displayName.toLowerCase() === username.toLowerCase());

// debugging...
//message.channel.send(`username: ${username}`, {code:"asciidoc"});
//message.channel.send(`user: ${user}`, {code:"asciidoc"});

  if(!user) {
    message.channel.send(`Error: user ${user.displayName} is not in ${role.name}`, {code:"asciidoc"});
    return;
  }

  user.removeRole(role);
  message.channel.send(`User ${user.displayName} removed from ${role.name}`, {code:"asciidoc"});

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "reject",
  category: "Guild Administration",
  description: "remove user from guild",
  usage: "reject <guild tag> <user>"
};
