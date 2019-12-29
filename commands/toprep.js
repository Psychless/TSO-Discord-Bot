const log = require("../logging.js");
const constants = require("../constants.js")
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        const rep = JSON.parse(fs.readFileSync(`./rep.json`));
        for (const key in rep) {
            if (!message.guild.members.get(key)) {
                delete rep[key];
            }
        }
        const users = [];
        for (const [key, val] of Object.entries(rep)) {
            users.push({user: key, rep: val});
        }

        let sortedUsers = users.sort((a, b) => (a.rep > b.rep) ? -1 : 1);
        if (sortedUsers.length > config.topUsers) {
            sortedUsers = sortedUsers.slice(0, config.topUsers);
        }

        let msg = ``;
        for (const [i, elem] of sortedUsers.entries()) {
            const member = message.guild.members.get(elem.user);
            if (!member) {
                continue;
            }
            msg += `${i + 1} - ${member.user.username}: **${elem.rep}**\n`;
        }

        const embed = new Discord.RichEmbed().setTitle(constants.TOP_USR_REP_LIST_TITLE).setDescription(msg).setColor(config.embedColour);
        message.channel.send({embed});

        fs.writeFileSync(`./rep.json`, JSON.stringify(rep, null, 4));
    });    
}
