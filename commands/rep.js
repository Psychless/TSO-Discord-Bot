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
            user = message.mentions.users.first();
            role = message.mentions.roles.first();
        } else {
            user = message.author;
        }

         
        if (!user && !role) {
            return message.channel.send(`Usage: ${config.cmdkey}rep @user/@role`);
        }

        if(user){
            const rep = JSON.parse(fs.readFileSync(`./rep.json`));
            if (!rep[user.id]) {
                rep[user.id] = 0;
            }

            message.channel.send(`${user.username} has ${rep[user.id]} ${constants.REP}.`);
        } else {
            const rep = JSON.parse(fs.readFileSync(`./rolerep.json`));
            if (!rep[role.id]) {
                rep[role.id] = 0;
            }

            message.channel.send(`${role.name} has ${rep[role.id]} ${constants.REP}.`);
        }
    });    
}
