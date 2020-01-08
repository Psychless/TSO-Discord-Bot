const log = require("../logging.js");
const constants = require("../constants.js")
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        // TODO: Remove this when command is done
        return message.channel.send(`This command is a WIP. Coming soon!`);

        if (args.length !== 1) {
            return message.channel.send(`Usage: ${config.cmdkey}fight @user`);
        }

        const user = message.guild.members.get(message.mentions.users.first().id);
        if (!user) {
            return message.channel.send(`Usage: ${config.cmdkey}fight @user`);
        }

        if (user.id === message.author.id) {
            return message.channel.send(`You cannot fight yourself.`);
        }

        const rep = JSON.parse(fs.readFileSync(`./data/rep.json`));
        if (!rep[user.id]) {
            rep[user.id] = 0;
        }

        if (!rep[message.author.id]) {
            rep[message.author.id] = 0;
        }

        if (rep[message.author.id] <= 0) {
            return message.channel.send(`You do not have enough ${constants.REP} to fight.`);
        }

        if (rep[user.id] <= 0) {
            return message.channel.send(`${user.displayName} does not have enough ${constants.REP} to fight.`);
        }

        const rand = Math.random() < 0.5;

        if (rand) {
            rep[user.id]++;
            rep[message.author.id]--;
            message.channel.send(`${user} ${constants.FIGHT_WIN_MSG}`);
        } else {
            rep[user.id]--;
            rep[message.author.id]++;
            message.channel.send(`${message.author} ${constants.FIGHT_WIN_MSG}`);
        }

        fs.writeFileSync(`./data/rep.json`, JSON.stringify(rep, null, 4));
    });    
}
