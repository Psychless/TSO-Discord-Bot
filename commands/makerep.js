const log = require("../logging.js");
const utils = require("../utils.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        if (!utils.isDev(message.member)) {
            return;
        }

        if (args.length !== 2) {
            return message.channel.send(`Usage: ${config.cmdkey}makerep @user number`);
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.channel.send(`Usage: ${config.cmdkey}makerep @user number`);
        }

        const number = parseInt(args[1]);
        if (isNaN(number)) {
            return message.channel.send(`Usage: ${config.cmdkey}makerep @user number`);
        }

        const rep = JSON.parse(fs.readFileSync(`./rep.json`));
        if (!rep[user.id]) {
            rep[user.id] = 0;
        }

        rep[user.id] = number;

        message.channel.send(`Set ${user.username}'s rep to ${number}.`);

        fs.writeFileSync(`./rep.json`, JSON.stringify(rep, null, 4));
    });    
}
