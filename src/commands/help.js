
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: "Displays list of bot commands with syntax",

    execute(client, message, args) {
        const helpEmbed = (message) => {
            let helpFields = [
                // {name: `help`, value: `Get a list of bot commands.\n\`\`${process.env.PREFIX}help\`\``, inline: false},
                {name: `add, a`, value: `Add a role to a user.\n\`\`${process.env.PREFIX}add <role name/mention> <member>\`\``, inline: false},
                {name: `remove, r`, value: `Remove a role from user.\n\`\`${process.env.PREFIX}remove <role name/mention> <member>\`\``, inline: false},
                {name: `user`, value: `Gets a user's information.\n\`\`${process.env.PREFIX}user / ${process.env.PREFIX}user <member>\`\``, inline: false},
                {name: `avatar`, value: `Gets a Discord User's tag & avatar.\n\`\`${process.env.PREFIX}avatar <discord ID/@mention>\`\``, inline: false},
                {name: `mute`, value: `Mutes a member in the server.\n\`\`${process.env.PREFIX}mute <member> <time> <reason>\`\``, inline: false},
                {name: `unmute`, value: `Unmutes a member in the server.\n\`\`${process.env.PREFIX}ban <member>\`\``, inline: false},
                {name: `kick`, value: `Kick a member from the server.\n\`\`${process.env.PREFIX}kick <member> <reason>\`\``, inline: false},
                {name: `ban`, value: `Bans a member from the server.\n\`\`${process.env.PREFIX}ban <member> <reason>\`\``, inline: false},
            ]
            richEmbed(message, false, "List of Bot Commands", false, true, message.guild.iconURL(), helpFields, 'BLUE');
        }
        
        helpEmbed(message);
    }
}