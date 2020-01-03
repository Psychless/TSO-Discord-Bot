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

        const roles = message.guild.roles.filter(role => role.name.match(/Squad$/)).array();
        let squads = [];

        for (const role of roles) {
            let tempSquad = {team: role.name, rep: 0};
            for (const member of role.members.array()) {
                if (!rep[member.id]) continue;
                tempSquad.rep += rep[member.id];
            }
            squads.push(tempSquad);
        }

        let sortedSquads = squads.sort((a, b) => (a.rep > b.rep) ? -1 : 1)
        if (sortedSquads.length > config.topUsers) {
            sortedSquads = sortedSquads.slice(0, config.topUsers);
        }

        let msg = ``;
        for (const [i, elem] of sortedSquads.entries()) {
            msg += `${i + 1} - ${elem.team}: ${elem.rep}\n`;
        }

        const embed = new Discord.RichEmbed().setTitle(constants.TOP_TEAM_REP_LIST_TITLE).setDescription(msg).setColor(config.embedColour);
        message.channel.send({embed});
    });    
}
