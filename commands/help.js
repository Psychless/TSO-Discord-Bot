const log = require("../logging.js");
const utils = require("../utils.js");
const constants = require("../constants.js");
const Discord = require("discord.js");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed().setColor(config.embedColour);

        // USER CMDS
        embed.setTitle("Commands")
        embed.setDescription(`
            **${config.cmdkey}help** - displays this message
            **${config.cmdkey}register <IGN>, <role>, <lane>, <server>, <timezone>** - registers you in the database and adds the squad role
            **${config.cmdkey}rep** - shows your ${constants.REP} balance
            **${config.cmdkey}rep <@user>** - shows the user's ${constants.REP} balance
            **${config.cmdkey}rep <@role>** - shows the role's ${constants.REP} balance
            **${config.cmdkey}toprep** - shows the users with the highest ${constants.REP}
            **${config.cmdkey}topsquads** - shows the squads with the highest total ${constants.REP}
            **${config.cmdkey}loot** - shows a list of all the items available for purchase
            **${config.cmdkey}buyloot <item index>** - buys the item and informs the admin
            **${config.cmdkey}roles** - shows a list of roles available for purchase
            **${config.cmdkey}buyrole <role index>** - buyse the role and automatically adds you to it
            ~~**${config.cmdkey}fight <@user>** - fight the user for 1 ${constants.REP}~~ **(WIP)**
        `);
        message.author.send({embed});

        // SQUAD CAPTAIN CMDS
        if(message.guild && (utils.isSquadCaptain(message.member) || utils.isDev(message.member))){
            embed.setTitle("Squad captain commands");
            embed.setDescription(`
                **${config.cmdkey}show <@user>** - shows user info from their \`register\` command
                **${config.cmdkey}findplayers** <rank> <lane> - finds all users within server with these ranks and lanes
            `)
            message.author.send({embed});
        }

        // ADMINISTRATOR / DEVELOPER CMDS
        if(message.guild && utils.isDev(message.member)){
            embed.setTitle("Admin commands");
            embed.setDescription(`
                **${config.cmdkey}giverep <@user or @role> <number>** - adds <number> amount of ${constants.REP} for the user or role
                **${config.cmdkey}takerep <@user or @role> <number>** - subtracts <number> amount of ${constants.REP} for the user or role
                **${config.cmdkey}setrep <@user or @role> <number>** - sets <number> of ${constants.REP} for the user or role
            `)
            message.author.send({embed});
        }

        message.delete();
    });    
}
