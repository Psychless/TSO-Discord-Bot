const log = require("../logging.js");
const constants = require("../constants.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        // Verify user input
        if (args.length !== 1) {
            return message.channel.send(`Usage: ${config.cmdkey}buyrole <role index>`);
        }

        const roleIndex = args.join(` `);
        if (!roleIndex) {
            return message.channel.send(`Usage: ${config.cmdkey}buyrole <role index>`);
        }

        // Initialize user's rep if not done already
        const rep = JSON.parse(fs.readFileSync(`./data/rep.json`));
        if (!rep[message.author.id]) {
            rep[message.author.id] = 0;
        }

        // Confirm that the role index exists
        const prices = JSON.parse(fs.readFileSync(`./prices.json`));
        if (!prices.roles[roleIndex]) {
            return message.channel.send(`This role does not exist.`);
        }

        // Find the server role by name
        const role =  message.guild.roles.find(r => r.name === prices.roles[roleIndex].role);
        if (message.member.roles.find(rl => rl.id === role.id)) {
            return message.channel.send(`You already have this role.`);
        }

        // Verify that user has enough balance
        if (rep[message.author.id] < prices.roles[roleIndex].price) {
            return message.channel.send(`You do not have enough ${constants.REP} to buy this role. Price: \`${prices.roles[roleIndex].price}\`, your ${constants.REP}: \`${rep[message.author.id]}\``);
        }

        // Buy and assign role
        rep[message.author.id] -= prices.roles[roleIndex].price;
        message.member.addRole(role);
        message.channel.send(`Role \`${prices.roles[roleIndex].role}\` bought for \`${prices.roles[roleIndex].price}\` ${constants.REP}.`);
        fs.writeFileSync(`./data/rep.json`, JSON.stringify(rep, null, 4));
    });    
}
