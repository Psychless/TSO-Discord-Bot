let config = require("./config.json");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
    // Role validations
    isDev: function(member) {
        return (member.hasPermission(`ADMINISTRATOR`) || member.roles.find(r => r.id === config.roleID_dev))
    },

    isSquadCaptain: function(member) {
        return (member.roles.find(r => r.id === config.roleID_squadcap))
    },

    // Invalid input rejects
    rejectRoleInput(message, roleName) {
        let msg = `Couldn't find lane \`${roleName}\`. Please validate your input\n`
        msg += '**Lanes:** '
        config.laneRoles.forEach(function(laneRole) {
            msg += `\`${laneRole.capitalize()}\` `
        });
        return message.channel.send(msg);
    },

    rejectRankInput(message, rankName) {
        let msg = `Couldn't find rank \`${rankName}\`. Please validate your input\n`
            msg += '**Ranks:** '
            config.squadEligibleRanks.forEach(function(rank) {
                msg += `\`${rank.capitalize()}\` `;
            })
            return message.channel.send(msg);
    },

    // Role clears
    cleanLaneRoles: function(message, exceptionRole) {
        cleanRolesFromArray(message, config.laneRoles,exceptionRole);
    },

    cleanSquadRoles: function(message, exceptionRole) {
        let squadRoles = [];
        config.squads.forEach(squad => {
            squadRoles.push(squad.name);
        });

        cleanRolesFromArray(message, squadRoles, exceptionRole);
    },

    // Squad object search
    findSquadByRank: function(rank) {
        let foundSquad;
        config.squads.forEach(squad => {
            if(squad.eloRange.includes(rank.toLowerCase())){
                foundSquad = squad;
            }
        });

        return foundSquad;
    },

    findSquadByName: function(squadName) {
        let foundSquad;
        config.squads.forEach(squad => {
            if(squad.name === squadName){
                foundSquad = squad;
            }
        });

        return foundSquad;
    },

    // Config check
    isValidRank: function(rank) {
        return config.squadEligibleRanks.includes(rank.toLowerCase());
    },

    // Guild search
    findRoleByID: function(message, roleID) {
        return message.guild.roles.find(r => r.id === roleID);
    },

    findRoleByName: function(message, roleName) {
        return message.guild.roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());
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
        if(!role) { return; }

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