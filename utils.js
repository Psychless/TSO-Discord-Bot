let config = require("./config.json");

module.exports = {
    isDev: function(member) {
        return (member.hasPermission(`ADMINISTRATOR`) || member.roles.find(r => r.name === config.rolename_dev))
    },

    isSquadCaptain: function(member) {
        return (member.roles.find(r => r.name === config.rolename_squadcap))
    },

    rejectRoleInput(message, roleName) {
        let msg = `Couldn't find lane \`${roleName}\`. Please validate your input\n`
        msg += '**Lanes:** '
        config.laneRoles.forEach(function(laneRole) {
            msg += `\`${laneRole.capitalise()}\` `
        });
        return message.channel.send(msg);
    },

    rejectRankInput(message, rankName) {
        let msg = `Couldn't find rank \`${rankName}\`. Please validate your input\n`
            msg += '**Ranks:** '
            Object.entries(config.squadElos).map(([rank]) => {
                msg += `\`${rank.capitalize()}\` `
            })
            return message.channel.send(msg);
    },

    rejectRegionInput(message, regionName){
        let msg = `Couldn't find region \`${regionName}\`. Please validate your input\n`
            msg += '**Regions:** '
            config.lolRegions.forEach(function(region) {
                msg += `\`${region}\` `
            });
            return message.channel.send(msg);
    },

    cleanLaneRoles: function(message, exceptionRole) {
        cleanRolesFromArray(message, config.laneRoles,exceptionRole);
    },

    cleanSquadRoles: function(message, exceptionRole) {
        cleanRolesFromArray(message, config.squadRoles, exceptionRole);
    }
};

/**
 * 
 * @param {Discord_message} message
 * @param {String_array} roleArray array of all the roles of the role type (squad, lane etc.)
 * @param {Discord_role} exceptionRole role that should be ignored and not removed (used if role has been recently added)
 */
function cleanRolesFromArray(message, roleArray, exceptionRole) {
    roleArray.forEach(function(roleName) {
        const role = message.guild.roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());

        /*
        Since discord API is async, the exception role might be added while the loop is ongoing
        and a just added role might be immediately removed
        */
        if(exceptionRole && role.id === exceptionRole.id) { return; }

        if (message.member.roles.find(rl => rl.id === role.id)) {
            message.member.removeRole(role);
        }
    });
}