const log = require("../logging.js");
const Discord = require("discord.js");
const fs = require("fs");
const schedule = require("node-schedule");

exports.run = (client, message, args, config) => {
    return new Promise((resolve, reject) => {
        if (!message.guild) {
            return;
        }

        if (args.length < 4) {
            return message.channel.send(`Usage: ${config.cmdkey}setreminder @role <time (24 hour)> <day of the week> <message>`);
        }

        const role = message.mentions.roles.first();
        if (!role) {
            return message.channel.send(`Usage: ${config.cmdkey}setreminder @role <time (24 hour)> <day of the week> <message>`);
        }

        let time = args[1].split(`:`);
        if (isNaN(time[0]) || isNaN(time[1]) || parseInt(time[0]) < 0 || parseInt(time[0]) > 23 || parseInt(time[1]) < 0 || parseInt(time[1]) > 59) {
            return message.channel.send(`Invalid time given. Format must be hh:mm`);
        }

        let hour = parseInt(time[1]) < 20 ? parseInt(time[0]) - 1 : parseInt(time[0]);
        if (hour < 0) {
            hour += 24;
        }
        const minutes = parseInt(time[1]) < 20 ? parseInt(time[1]) + 40 : parseInt(time[1]) - 20; 

        const acceptableDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const dayIndex = acceptableDays.indexOf(args[2].toLowerCase());
        if (dayIndex === -1) {
            return message.channel.send(`Invalid day of the week given.`);
        }

        const msg = args.slice(3).join(` `);

        const remChannel = message.guild.channels.find(channel => channel.name === config.reminderChannel);
        if (!remChannel) {
            message.channel.send(`Could not find the reminders channel. Please contact an admin.`);
            return log.logDate(`Could not find reminderChannel. Please check config.json`);
        }
        schedule.scheduleJob(`0 ${minutes} ${hour} * * ${dayIndex + 1}`, () => {
            remChannel.send(`Reminder ${role}: ${msg}`);
        });

        return message.channel.send(`Set reminder successfully for ${hour}:${minutes} on ${acceptableDays[dayIndex]}.`);
    });    
}
