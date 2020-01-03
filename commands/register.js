const log = require("../logging.js");
const utils = require("../utils.js");
const Discord = require("discord.js");
const fs = require("fs");

String.prototype.capitalise = function() {
    const char = this.charAt(0);
    return char.toUpperCase() + this.slice(1);
}

Array.prototype.toLowerCase = function() {
    let temp = [];
    for (const elem of this) {
        if (typeof elem !== `string`) {
            throw new Error(`Non-string array element detected`);
        }
        temp.push(elem.toLowerCase());
    }
    return temp;
}

exports.run = (client, message, args, config) => {
    return new Promise(async (resolve, reject) => {
        if (!message.guild) {
            return;
        }

        // Gather args and verify arg count
        args = message.content.slice(config.cmdkey.length + 'register'.length + 1).split(',');
        if (args.length !== 4) {
            return message.channel.send(`Usage: ${config.cmdkey}register IGN, lane, rank, timezone`);
        }

        // Prepare user input
        const username = message.member.nickname ? message.member.nickname : message.member.displayName;
        const inputIGN = args[0];
        const inputLane = args[1].trim().capitalise();
        const inputRank = args[2].trim().capitalise();
        const inputTimezone = args[3].trim().toUpperCase();

        // Validate lane input and assign corresponding lane role
        const laneRole = message.guild.roles.find(r => r.name.toLowerCase() === inputLane.toLowerCase())
        let addLaneRole = false;
        if(!laneRole) {
            let msg = `Couldn't find lane \`${inputLane.toLowerCase()}\`. Please validate your input\n`
            msg += 'Valid lane input: '
            config.laneRoles.forEach(function(laneRole) {
                msg += `\`${laneRole}\` `
            });
            return message.channel.send(msg);
        } else {
            if (message.member.roles.find(rl => rl.id !== laneRole.id)) {
                addLaneRole = true;
            }
        }

        // Validate rank input and assign corresponding squad role
        const squadRole = message.guild.roles.find(r => r.name === config.squadElos[inputRank.toLowerCase()])
        let addSquadRole = false;
        if(!squadRole) {
            let msg = `Couldn't find rank \`${inputRank.toLowerCase()}\`. Please validate your input\n`
            msg += 'Valid rank input: '
            Object.entries(config.squadElos).map(([rank]) => {
                msg += `\`${rank}\` `
            })
            return message.channel.send(msg);
        } else {
            if (message.member.roles.find(rl => rl.id !== squadRole.id)) {
                addSquadRole = true;
            }
        }

        // Prepare embed msg
        const embed = new Discord.RichEmbed()
            .setAuthor(username, message.author.avatarURL)
            .setDescription(`
                IGN: ${inputIGN}
                Role: ${inputLane}
                Rank: ${inputRank}
                Timezone: ${inputTimezone}
                Squad: ${squadRole.name}
            `)
            .setColor(config.embedColour);

        // Assign squad and lane roles
        if(addLaneRole) {
            utils.cleanLaneRoles(message, laneRole);
            message.member.addRole(laneRole);
            message.channel.send(`User has been assigned as **${laneRole.name}** and given the role`);
        }

        if(addSquadRole) {
            utils.cleanSquadRoles(message, squadRole);
            message.member.addRole(squadRole);
            if(addSquadRole) {message.channel.send(`User has been assigned to **${squadRole.name}** and given the role`);}
        }

        // Bot saved data output
        const data = JSON.parse(fs.readFileSync(`./data.json`));
        let isUpdate = data[message.author.id] ? true : false;
        message.channel.send(`${isUpdate ? `Updated` : `Registered`} user info:`, {embed});

        // Data save
        data[message.author.id] = [username, inputIGN, inputLane, inputRank, inputTimezone];
        fs.writeFileSync(`./data.json`, JSON.stringify(data, null, 4));
    });    
}
