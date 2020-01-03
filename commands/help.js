const log = require("../logging.js");
const utils = require("../utils.js");
const constants = require("../constants.js");
const Discord = require("discord.js");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        let embed = new Discord.RichEmbed()
        .setTitle("Commands")
        .setDescription(`
            **${config.cmdkey}help** - displays this message
            **${config.cmdkey}register IGN, role, lane, timezone** - registers you in the database and adds the squad role
            **${config.cmdkey}rep** - shows your ${constants.REP} balance
            **${config.cmdkey}rep @user** - shows the user's ${constants.REP} balance
            **${config.cmdkey}toprep** - shows the users with the highest ${constants.REP}
            **${config.cmdkey}topsquads** - shows the squads with the highest total ${constants.REP}
            **${config.cmdkey}loot** - shows a list of all the items available for purchase
            **${config.cmdkey}buyloot <item index>** - buys the item and informs the admin
            **${config.cmdkey}roles** - shows a list of roles available for purchase
            **${config.cmdkey}buyrole <role index>** - buyse the role and automatically adds you to it
            ~~**${config.cmdkey}fight @user** - fight the user for 1 ${constants.REP}~~ **(WIP)**
        `)
        .setColor(config.helpEmbedColour)
        message.author.send({embed});

        if(message.guild && utils.isDev(message.member)){
            embed.setTitle("Admin commands");
            embed.setDescription(`
                **${config.cmdkey}giverep/${config.cmdkey}takerep @user/@role number** - modifies the ${constants.REP} for the user or role
                **${config.cmdkey}setrep @user number** - sets the ${constants.REP} for the user
                **${config.cmdkey}show @user** - shows registered data for the user
            `)
            message.author.send({embed});
        }

        message.delete();
    });    
}
