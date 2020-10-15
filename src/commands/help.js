
const { richEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: "Displays list of bot commands with syntax",

    run: async (client, message, args) => {
        const helpEmbed = (message) => {
            let helpFields = [
                // {name: `help`, value: `Get a list of bot commands.\n\`\`${process.env.PREFIX}help\`\``, inline: false},
                {name: `add, a, addrole`, value: `Add a role to a user.\n\`\`${process.env.PREFIX}add <role name/mention> <member>\`\``, inline: true},
                {name: `remove, r`, value: `Remove a role from user.\n\`\`${process.env.PREFIX}remove <role name/mention> <member>\`\``, inline: true},
                {name: `user`, value: `Gets a user's information.\n\`\`${process.env.PREFIX}user / ${process.env.PREFIX}user <member>\`\``, inline: true},
                {name: `avatar, pfp, dp`, value: `Gets a Discord User's tag & avatar.\n\`\`${process.env.PREFIX}avatar <discord ID/@mention>\`\``, inline: true},
                {name: `mute, m`, value: `Mutes a member in the server.\n\`\`${process.env.PREFIX}mute <@member> <duration>\`\``, inline: true},
                {name: `unmute, um`, value: `Unmutes a member in the server.\n\`\`${process.env.PREFIX}unmute <@member>\`\``, inline: true},
                {name: `kick, k`, value: `Kick a member from the server.\n\`\`${process.env.PREFIX}kick <member> <reason>\`\``, inline: true},
                {name: `ban, b`, value: `Bans a member from the server.\n\`\`${process.env.PREFIX}ban <member> <reason>\`\``, inline: true},
                {name: `unban, ub`, value: `Unbans a member from the server.\n\`\`${process.env.PREFIX}unban <memberID/username> <reason>\`\``, inline: true},

            ]
            richEmbed(message, false, "List of Bot Commands", false, true, message.guild.iconURL(), helpFields, 'BLUE');
        }
        
        helpEmbed(message);
    }
}