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

  // check if guild role exists
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
    message.channel.send(`Error: Officer role does not exist for ${tag}!`, {code:"asciidoc"});
    return;
  }

  // get command role for tag
  cmdRole = g.roles.find(val => val.name.toLowerCase() === tag.toLowerCase() + " command");
  if(!officerRole) {
    message.channel.send(`Error: Command role does not exist for ${role}!`, {code:"asciidoc"});
    return;
  }


  // is author in command role?
  if(! cmdRole.members.find("id", message.author.id)) {
    message.channel.send(`Error: You do not have the ${cmdRole} role!`, {code:"asciidoc"});
    return;
  }

  // get target user name
//  user = g.members.find("displayName", username);
  user = role.members.find(val => val.displayName.toLowerCase(), username.toLowerCase());

// debugging...
//message.channel.send(`username: ${username}`, {code:"asciidoc"});
//message.channel.send(`user: ${user}`, {code:"asciidoc"});

  if(!user) {
    message.channel.send(`Error: user ${username} does not exist`, {code:"asciidoc"});
    return;
  }

  // is user in guild?
  if(!role.members.find("id", user.id)) {
    message.channel.send(`Error: ${user} is not in guild ${role}`, {code:"asciidoc"});
    return;
  }



  user.addRole(officerRole);
  message.channel.send(`User ${user} promoted to ${officerRole}`, {code:"asciidoc"});

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "promote",
  category: "Guild Administration",
  description: "promote member to officer",
  usage: "promote <tag> <user>"
};
