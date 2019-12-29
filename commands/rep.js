const log = require("../logging.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        let user;
        if (args.length === 1) {
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }

         
        if (!user) {
            return message.channel.send(`Usage: ${config.cmdkey}rep @user`);
        }

        const rep = JSON.parse(fs.readFileSync(`./rep.json`));
        if (!rep[user.id]) {
            rep[user.id] = 0;
        }

        message.channel.send(`${user.username} has ${rep[user.id]} rep.`);
    });    
}
