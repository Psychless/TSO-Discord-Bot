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
        if (args.length !== 5) {
            return message.channel.send(`Usage: ${config.cmdkey}register IGN, lane, rank, region, timezone`);
        }

        // Prepare user input
        const username = message.member.nickname ? message.member.nickname : message.member.displayName;
        const inputIGN = args[0];
        const inputLane = args[1].trim().capitalise();
        const inputRank = args[2].trim().capitalise();
        const inputRegion = args[3].trim().toUpperCase();
        const inputTimezone = args[4].trim().toUpperCase();

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
        let squadRole = message.guild.roles.find(r => r.name === config.squadElos[inputRank.toLowerCase()])
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

        // Validate region input and assign to wildcard squad if not from EUW region
        if(!config.lolRegions.includes(inputRegion)){
            addSquadRole = false;
            let msg = `Couldn't find region \`${inputRegion}\`. Please validate your input\n`
            msg += 'Valid region input: '
            config.lolRegions.forEach(function(region) {
                msg += `\`${region}\` `
            });
            return message.channel.send(msg);
        } else {
            if(inputRegion !== 'EUW'){
                squadRole = message.guild.roles.find(r => r.name === 'Wildcard Squad');
            }
        }

        // Prepare embed msg
        const embed = new Discord.RichEmbed()
            .setAuthor(username, message.author.avatarURL)
            .setDescription(`
                IGN: ${inputIGN}
                Role: ${inputLane}
                Rank: ${inputRank}
                Region: ${inputRegion}
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
        data[message.author.id] = [username, inputIGN, inputLane, inputRank, inputRegion, inputTimezone];
        fs.writeFileSync(`./data.json`, JSON.stringify(data, null, 4));
    });    
}
