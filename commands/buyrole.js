const log = require("../logging.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        if (args.length !== 1) {
            return message.channel.send(`Usage: ${config.cmdkey}buyrole @role`);
        }

        const role = message.mentions.roles.first();
        if (!role) {
            return message.channel.send(`Usage: ${config.cmdkey}buyrole @role`);
        }

        const rep = JSON.parse(fs.readFileSync(`./rep.json`));
        if (!rep[message.author.id]) {
            rep[message.author.id] = 0;
        }

        const prices = JSON.parse(fs.readFileSync(`./prices.json`));
        if (!prices.roles[role.name]) {
            return message.channel.send(`This role is not available for sale.`);
        }

        if (message.member.roles.find(rl => rl.id === role.id)) {
            return message.channel.send(`You already have this role.`);
        }

        if (rep[message.author.id] < prices.roles[role.name]) {
            return message.channel.send(`You do not have enough ${constants.REP} to buy this role. Price: \`${prices.roles[role.name]}\`, your ${constants.REP}: \`${rep[message.author.id]}\``);
        }

        rep[message.author.id] -= prices.roles[role.name];
        message.member.addRole(role);

        message.channel.send(`Role bought for \`${prices.roles[role.name]}\` ${constants.REP}.`);

        fs.writeFileSync(`./rep.json`, JSON.stringify(rep, null, 4));
    });    
}
