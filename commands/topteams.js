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
        for (const key in rep) {
            if (!message.guild.roles.get(key)) {
                delete rep[key];
            }
        }

        const teams = [];
        for (const [key, val] of Object.entries(rep)) {
            const role = message.guild.roles.get(key);
            if(!config.squadRoles.includes(role.name)){
                teams.push({name: role.name, rep: val});
            }
        }

        let sortedTeams = teams.sort((a, b) => (a.rep > b.rep) ? -1 : 1);
        if (sortedTeams.length > config.topUsers) {
            sortedTeams = sortedTeams.slice(0, config.topUsers);
        }

        let msg = ``;
        for (const [i, team] of sortedTeams.entries()) {
            if (!team) {
                continue;
            }
            msg += `${i + 1} - ${team.name}: **${team.rep}**\n`;
        }

        const embed = new Discord.RichEmbed().setTitle(constants.TOP_TEAM_REP_LIST_TITLE).setDescription(msg).setColor(config.embedColour);
        message.channel.send({embed});

        fs.writeFileSync(`./data/rolerep.json`, JSON.stringify(rep, null, 4));
    });    
}
