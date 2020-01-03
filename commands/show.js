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

        if(!utils.isDev(message.member)){
            return;
        }

        if (args.length !== 1) {
            return message.channel.send(`Usage: ${config.cmdkey}show @user`);
        }

        const user = message.mentions.members.first();
        if (!user) {
            return message.channel.send(`Usage: ${config.cmdkey}show @user`);
        }
        
        const data = JSON.parse(fs.readFileSync(`./data.json`));
        const userData = data[user.id];
        if (!userData) {
            return message.channel.send(`The user has not yet registered`);
        }

        const embed = new Discord.RichEmbed()
            .setAuthor(user.nickname, user.user.avatarURL)
            .setDescription(`
                IGN: ${userData[1]}
                Role: ${userData[2]}
                Rank: ${userData[3]}
                Region: ${userData[4]}
                Timezone: ${userData[5]}
            `)
            .setColor(config.embedColour);

        message.channel.send({embed});
    });    
}
