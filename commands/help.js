const log = require("../logging.js");
const constants = require("../constants.js");
const Discord = require("discord.js");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        const embed = new Discord.RichEmbed()
        .setTitle("Help")
        .setDescription(`
            **${config.cmdkey}register username, lane, rank, timezone, squad** - registers you in the database and adds the squad role
            **${config.cmdkey}show @user** - shows registered data for the user
            **${config.cmdkey}giverep, takerep @user/@role number** - modifies the ${constants.REP} for the user or role(admin only)
            **${config.cmdkey}makerep @user number** - sets the ${constants.REP} for the user (admin only)
            **${config.cmdkey}rep** - shows your ${constants.REP} balance
            **${config.cmdkey}rep @user** - shows the user's ${constants.REP} balance
            **${config.cmdkey}fight @user** - fight the user for 1 ${constants.REP}
            **${config.cmdkey}toprep** - shows the users with the highest ${constants.REP}
            **${config.cmdkey}topteams** - shows the guilds with the highest total ${constants.REP}
            **${config.cmdkey}buyrole @role** - buys the role and automatically adds you to it
            **${config.cmdkey}roles** - shows a list of roles available for purchase
            **${config.cmdkey}buyticket ticket** - buys the ticket and messages an admin
            **${config.cmdkey}tickets** - shows a list of tickets available for purchase
            **${config.cmdkey}setreminder @role <time (24 hour)> <day of the week> <message>** - sets a new reminder which will send 20 minutes before the time specified
        `)
        .setColor(config.helpEmbedColour)
        message.channel.send({embed});
    });    
}
