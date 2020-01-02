const log = require("../logging.js");
const constants = require("../constants.js");
const Discord = require("discord.js");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        const embed = new Discord.RichEmbed()
        .setTitle("Help")
        .setDescription(`
            **${config.cmdkey}register username, lane, rank, timezone, squad** - registers you in the database and adds the squad role
            **${config.cmdkey}rep** - shows your ${constants.REP} balance
            **${config.cmdkey}rep @user** - shows the user's ${constants.REP} balance
            **${config.cmdkey}fight @user** - fight the user for 1 ${constants.REP}
            **${config.cmdkey}toprep** - shows the users with the highest ${constants.REP}
            **${config.cmdkey}topteams** - shows the guilds with the highest total ${constants.REP}
            **${config.cmdkey}buyrole <role index>** - buyse the role and automatically adds you to it
            **${config.cmdkey}roles** - shows a list of roles available for purchase
            **${config.cmdkey}buyloot <item index>** - buys the item and informs the admin
            **${config.cmdkey}loot** - shows a list of all the items available for purchase`
            +
            
            \n\n
            **${config.cmdkey}giverep, takerep @user/@role number** - modifies the ${constants.REP} for the user or role(admin only)
            **${config.cmdkey}makerep @user number** - sets the ${constants.REP} for the user (admin only)
            **${config.cmdkey}show @user** - shows registered data for the user
        `)
        .setColor(config.helpEmbedColour)
        message.channel.send({embed});
    });    
}
