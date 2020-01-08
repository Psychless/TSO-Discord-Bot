const log = require("../logging.js");
const constants = require("../constants.js")
const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        const rep = JSON.parse(fs.readFileSync(`./data/rolerep.json`));

        const roles = message.guild.roles.filter(role => config.squadRoles.includes(role.name)).array();
        let squads = [];

        for (const role of roles) {
            squads.push({team: role.name, rep: rep[role.id] ? rep[role.id] : 0});
        }

        let sortedSquads = squads.sort((a, b) => (a.rep > b.rep) ? -1 : 1)
        if (sortedSquads.length > config.topUsers) {
            sortedSquads = sortedSquads.slice(0, config.topUsers);
        }

        let msg = ``;
        for (const [i, elem] of sortedSquads.entries()) {
            msg += `${i + 1} - ${elem.team}: ${elem.rep}\n`;
        }

        const embed = new Discord.RichEmbed().setTitle(constants.TOP_SQUAD_REP_LIST_TITLE).setDescription(msg).setColor(config.embedColour);
        message.channel.send({embed});
    });    
}
