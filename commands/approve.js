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
  if(args.length < 1) {
    message.channel.send("Error: missing arguments");
    return;
  }
  tag = args[0].toUpperCase();
  username = message.mentions.users.first();
//  message.reply(`user: ${message.mentions.users.first()}`);
  // ********** SETUP **********
  // get server
  let g = message.guild;
  if(debug) message.channel.send(`Server:: ${message.guild.name}`, {code:"asciidoc"});

  user = g.fetchMember(username);
//  message.reply(`user.id: _${username}_`);

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
    message.channel.send(`Error: officer role does not exist for ${tag}!`, {code:"asciidoc"});
    return;
  }
  // is author in officer role?
  if(! officerRole.members.find("id", message.author.id)) {
    message.channel.send(`Error: You do not have the ${officerRole} role!`, {code:"asciidoc"});
    return;
  }

  // get guest role
  guestRole = g.roles.find(val => val.name.toLowerCase() === "guest");
  if(!guestRole) {
    message.channel.send(`Error: guest role does not exist!`, {code:"asciidoc"});
    return;
  }

  // get target user name
//  user = g.members.find("displayName", username);
  message.guild.fetchMember(username)
    .then(user => {
      if(!user) {
        message.channel.send(`Error: user ${username} does not exist`, {code:"asciidoc"});
        return;
      }
      user.removeRole(guestRole)
      user.addRole(role);
      message.channel.send(`User ${username} added to ${role.name}`);
    })
    .catch(console.error);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "approve",
  category: "Guild Administration",
  description: "add user to guild (Officer)",
  usage: "approve <tag> <user>"
};
