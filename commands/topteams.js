const log = require("../logging.js");
const Discord = require("discord.js");
const fs = require("fs");

function sortRep(users) {
    let temp = [];
    let inserted = false;
    for (const user of users) {
        for (const [i, elem] of temp.entries()) {
            if (user.rep < elem.rep) {
                temp.splice(i, 0, user);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            temp.push(user);
        }
    }
    return temp;
}

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

        let sorted = sortRep(squads).reverse();
        if (sorted.length > config.topUsers) {
            sorted = sorted.slice(0, config.topUsers);
        }

        let msg = ``;
        for (const [i, elem] of sorted.entries()) {
            msg += `${i + 1} - ${elem.team}: ${elem.rep}\n`;
        }

        const embed = new Discord.RichEmbed().setTitle(`Top rep`).setDescription(msg).setColor(config.embedColour);
        message.channel.send({embed});
    });    
}
