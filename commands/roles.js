const log = require("../logging.js");
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        const prices = JSON.parse(fs.readFileSync(`./prices.json`));

        let msg = ``;
        for (const key in prices.roles) {
            msg += `${key}: \`${prices.roles[key]}\`\n`;
        }

        const embed = new Discord.RichEmbed().setTitle(`Roles for sale`).setDescription(msg).setColor(config.embedColour);
        message.channel.send({embed});
    });    
}