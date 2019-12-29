const Discord = require("discord.js");
const client = new Discord.Client();
var config = require("./config.json");
const log = require("./logging.js");
const fs = require("fs");

client.on("message", message => {
    if (message.author.bot) return;

    if (message.content.substring(0, 1) !== config.cmdkey) return;

    const args = message.content.slice(config.cmdkey.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        let commandFile = require(`./commands/${command}.js`);
        if (!commandFile) return;
        commandFile.run(client, message, args, config).then((success) => {
            log.logDate(`${command}: ` + success);
        }, (err) => {
            log.logDate(`${command}: ` + err);
        });
    } 
    catch (e) {
        log.logDate(e);
    }
});

client.on("ready", () => {
    log.logDate("Bot started");
});

client.on("error", (err) => {
    log.logDate(`There was an error: ${err.name}: ${err.message}`);
});

client.login(config.clientKey);
