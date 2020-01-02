const log = require("../logging.js");
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
            return message.channel.send(`Usage: ${config.cmdkey}register IGN, role, rank, timezone`);
        }

        const username = message.member.nickname;
        const inputIGN = args[0];
        const inputRole = args[1].capitalise();
        const inputRank = args[2].capitalise().trim();
        const inputTimezone = args[3].toUpperCase().trim();

        // Validate rank input and assign corresponding squad role
        const squadRole = message.guild.roles.find(r => r.name === config.squadElos[inputRank.toLowerCase()])
        if(!squadRole) {
            let msg = `Couldn't find rank \`${inputRank.toLowerCase()}\`. Please validate your input\n`
            msg += 'Valid rank input: '
            Object.entries(config.squadElos).map(([rank]) => {
                msg += `\`${rank}\` `
            })
            return message.channel.send(msg);
        } else {
            if (message.member.roles.find(rl => rl.id !== squadRole.id)) {
                message.member.addRole(squadRole);
            }
        }
        
        const data = JSON.parse(fs.readFileSync(`./data.json`));
        let isUpdate = data[message.author.id] ? true : false;

        const embed = new Discord.RichEmbed()
            .setAuthor(username, message.author.avatarURL)
            .setDescription(`
                IGN: ${inputIGN}
                Role: ${inputRole}
                Rank: ${inputRank}
                Timezone: ${inputTimezone}
                Squad: ${squadRole.name}
            `)
            .setColor(config.embedColour);

        message.channel.send(`${isUpdate ? `Updated` : `Registered`} user info:`, {embed});
        message.channel.send(`User has been assigned to **${squadRole.name}** and given the role`);

        data[message.author.id] = [username, inputIGN, inputRole, inputRank, inputTimezone];
        fs.writeFileSync(`./data.json`, JSON.stringify(data, null, 4));
        message.delete();
    });    
}
