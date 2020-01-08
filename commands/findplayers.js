const log = require("../logging.js");
const utils = require("../utils.js");
const Discord = require("discord.js");
const fs = require("fs");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function updateOutputPlayerList(playerList, maxPage, curPage, playersPerPage, embed, message) {
    const member = message.guild.members.get(message.author.id);
    let content = '';
    for(let i = (curPage - 1) * playersPerPage; i < curPage * playersPerPage; i++){
        if(playerList[i]){
            content += `• ${playerList[i]}\n`;
        }
    };

    embed.setDescription(content);
    embed.setFooter(`Page ${curPage} of ${maxPage} • ${member.displayName}`, member.user.avatarURL);
}

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        if (!utils.isDev(message.member) || !utils.isSquadCaptain(message.member)) {
            return;
        }

        if (args.length < 2) {
            return message.channel.send(`Usage: ${config.cmdkey}findplayers rank, lane`);
        }

        // Prepare user input
        const inputRank = args[0].trim().capitalize();
        const inputLane = args[1].trim().capitalize();

        // Validate rank
        const rankRole = message.guild.roles.find(r => r.name.toLowerCase() in config.squadElos)
        if(!rankRole) {
            utils.rejectRankInput(message, inputRank.toLowerCase());
            return;
        }

        // Validate lane
        const laneRole = message.guild.roles.find(r => r.name.toLowerCase() === inputLane.toLowerCase())
        if(!laneRole) {
            utils.rejectRoleInput(message, inputLane.toLowerCase());
            return;
        }

        if(rankRole && laneRole){
            // Filter all users with no squad and the desired rank & lane
            let playerList = [];
            
            const isNotSquadRole = (role) => !config.squadRoles.includes(role.name);
            message.guild.members.forEach(user => {
                if(user.roles.find(r => r.id === rankRole.id) && 
                    user.roles.find(r => r.id === laneRole.id) &&
                    user.roles.every(isNotSquadRole)) {
                    playerList.push(user);
                }
            })

            if(!playerList) {
                message.channel.send("Couldn't find any players with these criteria");
                return;
            }

            // Define variables
            const time = config.playerListControlTime;  // Time frame for reactions to work (millis)
            const playersPerPage = config.playersPerListPage; // Players shown per page
            const minPage = 1;
            const maxPage = Math.ceil(playerList.length / playersPerPage);
            let curPage = minPage;

            // Create embed
            let embed = new Discord.RichEmbed()
            .setTitle(`${playerList.length} players found | ${rankRole.name} - ${laneRole.name}`)
            .setColor(config.embedColour);

            // Send initial list msg and wait for list control reactions
            updateOutputPlayerList(playerList, maxPage, curPage, playersPerPage, embed, message);
            message.channel.send({embed}).then(async function (msg) {
                msg.react('⬅️');
                await new Promise(r => setTimeout(r, 500)); // HTTP 429
                msg.react('➡️');
                await new Promise(r => setTimeout(r, 500)); // HTTP 429
                msg.react('🗑️');
                await new Promise(r => setTimeout(r, 250)); // HTTP 429

                 const filter = (reaction, user) => {
                    return ['⬅️', '➡️', '🗑️'].includes(reaction.emoji.name) && user.id === message.author.id;
                 };
           
                 const collector = msg.createReactionCollector(filter, { time: time });
           
                 collector.on('collect', (reaction, reactionCollector) => {
                    if (reaction.emoji.name === '⬅️') {
                        curPage -= 1;
                        if(curPage < minPage) {
                            curPage = minPage;
                        }
                        updateOutputPlayerList(playerList, maxPage, curPage, playersPerPage, embed, message);
                        msg.edit({embed});
                    }
                    
                    if (reaction.emoji.name === '➡️') {
                        curPage += 1;
                        if(curPage > maxPage) {
                            curPage = maxPage;
                        }
                        updateOutputPlayerList(playerList, maxPage, curPage, playersPerPage, embed, message);
                        msg.edit({embed});
                    }
                    
                    if (reaction.emoji.name === '🗑️') {
                        msg.delete();
                    }

                    // Remove extra reactions
                    const userReactions = msg.reactions.filter(reaction => reaction.users.has(message.author.id));
                    try {
                        for (const [key, reaction] of userReactions) {
                            reaction.remove(message.author);
                        }
                    } catch (error) {
                        log.logDate('Failed to remove reactions.');
                    }
                 });
            });
        }
    });
}
