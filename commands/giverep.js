const log = require("../logging.js");
const utils = require("../utils.js");
const constants = require("../constants.js");
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
            return message.channel.send(`Usage: ${config.cmdkey}giverep @user/@role number`);
        }

        const user = message.mentions.users.first();
        const role = message.mentions.roles.first();
        if (!user && !role) {
            return message.channel.send(`Usage: ${config.cmdkey}giverep @user/@role number`);
        }

        const number = parseInt(args[1]);
        if (isNaN(number)) {
            return message.channel.send(`Usage: ${config.cmdkey}giverep @user/@role number`);
        }

        const rep = JSON.parse(fs.readFileSync(`./rep.json`));

        if (user) {
            if (!rep[user.id]) {
                rep[user.id] = 0;
            }
    
            rep[user.id] += number;
    
            message.channel.send(`Added ${number} ${constants.REP} to ${user.username}. Total ${constants.REP}: ${rep[user.id]}`);
        }
        else {
            const roleMembers = role.members.size;
            const addition = Math.floor(number / roleMembers);

            for (const member of role.members.array()) {
                if (!rep[member.id]) {
                    rep[member.id] = 0;
                }
        
                rep[member.id] += addition;
            }

            message.channel.send(`Added ${addition * roleMembers} ${constants.REP} total to ${role}.`);
        }

        fs.writeFileSync(`./rep.json`, JSON.stringify(rep, null, 4));
    });    
}
