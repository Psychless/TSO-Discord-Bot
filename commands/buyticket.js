const log = require("../logging.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        if (args.length < 1) {
            return message.channel.send(`Usage: ${config.cmdkey}buyticket ticket`);
        }

        const ticket = args.join(` `);

        const rep = JSON.parse(fs.readFileSync(`./rep.json`));
        if (!rep[message.author.id]) {
            rep[message.author.id] = 0;
        }

        const prices = JSON.parse(fs.readFileSync(`./prices.json`));
        if (!prices.tickets[ticket]) {
            return message.channel.send(`This ticket does not exist.`);
        }

        if (rep[message.author.id] < prices.tickets[ticket]) {
            return message.channel.send(`You do not have enough ${constants.REP} to buy this ticket. Price: \`${prices.tickets[ticket]}\`, your ${constants.REP}: \`${rep[message.author.id]}\``);
        }

        rep[message.author.id] -= prices.tickets[ticket]

        const supportChannel = message.guild.channels.find(channel => channel.name === config.ticketChannel);
        if (!supportChannel) {
            message.channel.send(`Could not find the ticket support channel. Please contact the admin.`);
            return log.logDate(`Could not find the ticketChannel. Please check config.json`);
        }

        const embed = new Discord.RichEmbed().setTitle(`New order from ${message.author.username}`)
        .setDescription(`Ticket: ${ticket}\nPrice: \`${prices.tickets[ticket]}\`\nUser: ${message.author}`)
        .setColor(config.embedColour);

        supportChannel.send({embed});
        message.channel.send(`Ticket bought for \`${prices.tickets[ticket]}\` ${constants.REP}. An admin will be in contact with you shortly.`);

        fs.writeFileSync(`./rep.json`, JSON.stringify(rep, null, 4));
    });    
}
