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

        args = args.join('').split(`,`).toLowerCase();
        if (args.length !== 5) {
            return message.channel.send(`Usage: ${config.cmdkey}register username, lane, rank, timezone, squad`);
        }
        
        const data = JSON.parse(fs.readFileSync(`./data.json`));
        let isUpdate = false;
        if (data[message.author.id]) {
            isUpdate = true;
        }

        const squad = args[4].capitalise();
        const roleName = `${squad} Squad`;
        let role = message.guild.roles.find(role => role.name === roleName);
        if (!role) {
            message.channel.send(`Could not find the role ${roleName}. Creating...`);
            role = await message.guild.createRole({
                name: roleName
            }).catch(err => log.logDate(`Could not create a role:\n${err}`));
        }

        if (role == null) {
            return;
        }

        message.member.addRole(role);

        const embed = new Discord.RichEmbed()
            .setTitle(args[0].capitalise())
            .setDescription(`Lane: ${args[1].capitalise()}\nRank: ${args[2].capitalise()}\nTimezone: ${args[3].toUpperCase()}\nSquad: ${args[4].capitalise()}`)
            .setColor(config.embedColour);

        message.channel.send(`User ${isUpdate ? `updated` : `registered`}.`, {embed});

        data[message.author.id] = args;
        fs.writeFileSync(`./data.json`, JSON.stringify(data, null, 4));
        //message.delete();
    });    
}
