const log = require("../logging.js");
const constants = require("../constants.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        if (args.length < 1) {
            return message.channel.send(`Usage: ${config.cmdkey}buyloot <item index>`);
        }

        const itemIndex = args.join(` `);

        const rep = JSON.parse(fs.readFileSync(`./rep.json`));
        if (!rep[message.author.id]) {
            rep[message.author.id] = 0;
        }

        const prices = JSON.parse(fs.readFileSync(`./prices.json`));
        if (!prices.loot[itemIndex]) {
            return message.channel.send(`This item does not exist.`);
        }

        const lootItem = prices.loot[itemIndex]

        if (rep[message.author.id] < lootItem.price) {
            return message.channel.send(`You do not have enough ${constants.REP} to buy this item. Price: \`${lootItem.price}\`, your ${constants.REP}: \`${rep[message.author.id]}\``);
        }

        rep[message.author.id] -= lootItem.price;

        const botChannel = message.guild.channels.find(channel => channel.name === config.botChannel);
        if (!botChannel) {
            message.channel.send(`Could not find the reward notification channel. Please contact the admin.`);
            return log.logDate(`Could not find the botChannel. Please check config.json`);
        }

        const embed = new Discord.RichEmbed().setTitle(`New order from ${message.author.username}`)
        .setDescription(`
            Item: **${lootItem.name}**
            Price: \`${lootItem.price}\`
            User: ${message.author}
        `)
        .setColor(config.embedColour);

        botChannel.send(`<@&${message.guild.roles.find(r => r.name === 'Administrator').id}>`);
        botChannel.send({embed});
        message.channel.send(`Item \`${lootItem.name}\` bought for \`${lootItem.price}\` ${constants.REP}. An admin will be in contact with you shortly.`);
        fs.writeFileSync(`./rep.json`, JSON.stringify(rep, null, 4));
    });
}
