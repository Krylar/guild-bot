const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);
//  let ndx = args.findIndex(function(element) {return element === "debug"});
//  message.channel.send(`Debug? ${ndx}`);
//  if(ndx >>> 0) {
//    args.splice(ndx, 1);
//  }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  var err=0;

  if(args.length < 2) {
    message.channel.send("Error: missing arguments");
    return;
  }
  if(message.mentions.members.size<1) {
    message.channel.send("You must supply a valid user!");
    return;
  }

  guildOwner = message.mentions.members.first();
//  message.reply(`owner: ${guildOwner}`);

  gTag = args[0].toUpperCase();
//  message.reply(`TAG: ${gTag}`);

  // check for dependencies
  dependentRolesNames = ["Admin","Moderator","bot"];
  var dependentRoles = new Discord.Collection();
  var dr;
  dependentRolesNames.forEach(r => {
    dr = message.guild.roles.find(m => m.name === r);
    //message.reply(`role: ${dr}`);
    if(!dr) {
      message.reply(`Missing dependent role: ${r}!`);
      err=1;
    }
    dependentRoles.set(r, dr);
  });
    dependentRoles.set("everyone", message.guild.defaultRole);

  // check if category already exists
  if(message.guild.channels.find(ch => ch.name === gTag && ch.type === "category")) {
    message.reply(`Category for ${gTag} already exists!`);
    return;
  }
//  message.reply(`Creating category for ${gTag}`);

  // check if roles already exist
  guildRolesSuffixes = [" Command", " Officer", ""];
  guildRolesSuffixes.forEach(r => {
    roleName = gTag + r;
//    message.reply(`rolename: ${roleName}`);
    dr = message.guild.roles.find(m => m.name.toLowerCase() === roleName.toLowerCase());
//    message.reply(`role: ${dr}`);
    if(dr) {
      message.channel.send(`Guild role already exists: ${roleName}!`);
      err=1;
    }
  });

  // Check if any dependencies threw an error
  if(err>>0) {
    console.log("Exiting due to error!");
    return;
  }

  //var guildRoles = [];
  guildRoles = new Discord.Collection();
  // create roles
  guildRolesSuffixes.forEach(r => {
    roleName = gTag + r;
    if(r === " Command") {
      hoist=false;
    }
    else {
      hoist=true;
    };
    message.channel.guild.createRole({
      name: roleName,
      hoist: hoist,
      mentionable: hoist
    })
      .then(role => {
        guildRoles.set(role.name, role);
        tmp = guildRoles.get(role.name);
//        message.reply(`Created role: ${tmp}`);
      })
      .catch(console.error);
  });

  // generate category permissions
  await sleep(1000);
  // TAG Command
  roleCmd = guildRoles.get(gTag + ' Command');
//  message.reply(`Check role: ${roleCmd}`);
  roleOfc = guildRoles.get(gTag + ' Officer');
//  message.reply(`Check role: ${roleOfc}`);
  roleMbr = guildRoles.get(gTag);
//  message.reply(`Check role: ${roleMbr}`);

  // give owner the Command role
  guildOwner.addRole(roleCmd);

  // create category
  roleAdm = dependentRoles.get('Admin');
  newCategory = message.guild.createChannel(gTag, 'category', [{
    id: roleAdm.id, // Admin
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: message.guild.id, // everyone
    denied: ['VIEW_CHANNEL','CONNECT']
  },{
    id: roleCmd.id, // TAG Command
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: roleOfc.id, // TAG Officer
    allowed: ['VIEW_CHANNEL','CONNECT','MENTION_EVERYONE','MUTE_MEMBERS']
  },{
    id: roleMbr.id, // TAG Member
    allowed: ['VIEW_CHANNEL','CONNECT']
  }])
    .then(newCat => {
    message.guild.createChannel(gTag + '-chat', 'text', [{
    id: roleAdm.id, // Admin
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: message.guild.id, // everyone
    denied: ['VIEW_CHANNEL','CONNECT']
  },{
    id: roleCmd.id, // TAG Command
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: roleOfc.id, // TAG Officer
    allowed: ['VIEW_CHANNEL','CONNECT','MENTION_EVERYONE','MUTE_MEMBERS']
  },{
    id: roleMbr.id, // TAG Member
    allowed: ['VIEW_CHANNEL','CONNECT']
  }])
      .then(n => n.setParent(newCat))
      .catch(console.error);
    message.guild.createChannel(gTag + '-galactic', 'text', [{
    id: roleAdm.id, // Admin
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: message.guild.id, // everyone
    denied: ['VIEW_CHANNEL','CONNECT']
  },{
    id: roleCmd.id, // TAG Command
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: roleOfc.id, // TAG Officer
    allowed: ['VIEW_CHANNEL','CONNECT','MENTION_EVERYONE','MUTE_MEMBERS']
  },{
    id: roleMbr.id, // TAG Member
    allowed: ['VIEW_CHANNEL','CONNECT']
  }])
      .then(n => n.setParent(newCat))
      .catch(console.error);
    message.guild.createChannel(gTag.toLowerCase() + '-galactic-voice', 'voice', [{
    id: roleAdm.id, // Admin
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: message.guild.id, // everyone
    denied: ['VIEW_CHANNEL','CONNECT']
  },{
    id: roleCmd.id, // TAG Command
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: roleOfc.id, // TAG Officer
    allowed: ['VIEW_CHANNEL','CONNECT','MENTION_EVERYONE','MUTE_MEMBERS']
  },{
    id: roleMbr.id, // TAG Member
    allowed: ['VIEW_CHANNEL','CONNECT']
  }])
      .then(n => n.setParent(newCat))
      .catch(console.error);

    // create TAG Command channel
    message.guild.createChannel(gTag.toLowerCase() + '-command', 'text', [{
    id: roleAdm.id, // Admin
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: message.guild.id, // everyone
    denied: ['VIEW_CHANNEL','CONNECT']
  },{
    id: roleCmd.id, // TAG Command
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES']
  }])
      .then(n => n.setParent(newCat))
      .catch(console.error);


    // create TAG Officer channel
    message.guild.createChannel(gTag.toLowerCase() + '-officer', 'text', [{
    id: roleAdm.id, // Admin
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES','PRIORITY_SPEAKER']
  },{
    id: message.guild.id, // everyone
    denied: ['VIEW_CHANNEL','CONNECT']
  },{
    id: roleCmd.id, // TAG Command
    allowed: ['VIEW_CHANNEL','CONNECT','MANAGE_ROLES']
  },{
    id: roleOfc.id, // TAG Officer
    allowed: ['VIEW_CHANNEL','CONNECT','MENTION_EVERYONE','MUTE_MEMBERS']
  }])
      .then(n => n.setParent(newCat))
      .catch(console.error);


  });


    message.channel.send(`New guild ${gTag} created!`, {code:"asciidoc"});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Admin"
};

exports.help = {
  name: "create",
  category: "Guild Administration",
  description: "Create new guild channels & roles",
  usage: "create <tag> <owner>"
};
