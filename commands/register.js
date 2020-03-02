const log = require("../logging.js");
const utils = require("../utils.js");
const Discord = require("discord.js");
const fs = require("fs");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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
        const inputIGN = args[0];
        const inputLane = args[1].trim().capitalize();
        const inputRank = args[2].trim().capitalize();
        const inputTimezone = args[3].trim().toUpperCase();

        // Validate lane input and assign corresponding lane role
        const laneRole = utils.findRoleByName(message, inputLane);
        let addLaneRole = false;
        if(!laneRole) {
            utils.rejectRoleInput(message, inputLane.toLowerCase());
            return;
        } else {
            if (message.member.roles.find(rl => rl.id !== laneRole.id)) {
                addLaneRole = true;
            }
        }

        // Validate rank input and assign corresponding squad role
        let squad;
        let squadRole;
        if(utils.isValidRank(inputRank)){
            squad = utils.findSquadByRank(inputRank);
            if(squad) {
                squadRole = utils.findRoleByID(message, squad.roleID);
            }
        }
        let addSquadRole = false;
        if(!squadRole) {
            utils.rejectRankInput(message, inputRank.toLowerCase());
            return;
        } else {
            if (message.member.roles.find(rl => rl.id !== squadRole.id)) {
                addSquadRole = true;
            }
        }

        // Prepare embed msg
        const embed = new Discord.RichEmbed()
            .setAuthor(message.member.displayName, message.author.avatarURL)
            .setDescription(`
                **IGN**: ${inputIGN}
                **Role**: ${inputLane}
                **Rank**: ${inputRank}
                **Timezone**: ${inputTimezone}
                **Squad**: ${squad.name}
            `)
            .setColor(config.embedColour)
            .setFooter(`Squad captain! To see this info again, use command - $show @${message.member.displayName}`);

        // Assign squad and lane roles
        if(addLaneRole) {
            utils.cleanLaneRoles(message, laneRole);
            message.member.addRole(laneRole);
        }

        if(addSquadRole) {
            utils.cleanSquadRoles(message, squadRole);
            message.member.addRole(squadRole);
        }

        // Bot saved data output
        const data = JSON.parse(fs.readFileSync(`./data/data.json`));
        let isUpdate = data[message.author.id] ? true : false;
        message.channel.send(`${isUpdate ? `Updated` : `Registered`} user info:`, {embed});

        // Send announcement in the assigned squad's chat room
        const squadChannel = message.guild.channels.get(squad.mainChatID);
        squadChannel.send(`<@&${config.roleID_squadcap}>\nPlease welcome <@${message.author.id}> to the ${squad.name}!\nYour squad captain should contact you soon about team placements!`);
        squadChannel.send({embed});

        // Data save
        data[message.author.id] = [message.member.displayName, inputIGN, inputLane, inputRank, inputTimezone];
        fs.writeFileSync(`./data/data.json`, JSON.stringify(data, null, 4));
    });    
}
