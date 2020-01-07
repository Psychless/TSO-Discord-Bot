const log = require("../logging.js");
const utils = require("../utils.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        if (!utils.isDev) {
            return;
        }

        if (args.length !== 2) {
            return message.channel.send(`Usage: ${config.cmdkey}takerep @user/@role number`);
        }

        const user = message.mentions.users.first();
        const role = message.mentions.roles.first();
        if (!user && !role) {
            return message.channel.send(`Usage: ${config.cmdkey}giverep @user/@role number`);
        }

        const number = parseInt(args[1]);
        if (isNaN(number)) {
            return message.channel.send(`Usage: ${config.cmdkey}takerep @user/@role number`);
        }

        if (user) {
            const rep = JSON.parse(fs.readFileSync(`./rep.json`));
            if (!rep[user.id]) {
                rep[user.id] = 0;
            }
    
            // Take away rep (min 0)
            rep[user.id] -= number;
            if(rep[user.id] <= 0){
                rep[user.id] = 0;
            }
    
            message.channel.send(`Took ${number} rep from ${user.username}. Total rep: ${rep[user.id]}`);
            fs.writeFileSync(`./rep.json`, JSON.stringify(rep, null, 4));
        } else {
            const rep = JSON.parse(fs.readFileSync(`./rolerep.json`));
            if (!rep[role.id]) {
                rep[role.id] = 0;
            }
    
            rep[role.id] -= number;
            if(rep[role.id] <= 0){
                rep[role.id] = 0;
            }

            message.channel.send(`Took ${number} rep from ${role.name}. Total rep: ${rep[role.id]}`);
            fs.writeFileSync(`./rolerep.json`, JSON.stringify(rep, null, 4));
        }
    });    
}
