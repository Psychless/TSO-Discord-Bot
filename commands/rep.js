const log = require("../logging.js");
const constants = require("../constants.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        let user;
        let role;
        if (args.length === 1) {
            user = message.guild.members.get(message.mentions.users.first().id);
            role = message.mentions.roles.first();
        } else {
            user = message.guild.members.get(message.author.id);
        }

         
        if (!user && !role) {
            return message.channel.send(`Usage: ${config.cmdkey}rep @user/@role`);
        }

        if(user){
            const rep = JSON.parse(fs.readFileSync(`./data/rep.json`));
            if (!rep[user.id]) {
                rep[user.id] = 0;
            }

            message.channel.send(`${user.displayName} has ${rep[user.id]} ${constants.REP}`);
        } else {
            const rep = JSON.parse(fs.readFileSync(`./data/rolerep.json`));
            if (!rep[role.id]) {
                rep[role.id] = 0;
            }

            message.channel.send(`${role.name} has ${rep[role.id]} ${constants.REP}`);
        }
    });    
}
