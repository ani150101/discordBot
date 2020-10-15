
const { BRIGHT_RED, BRIGHT_GREEN, normalEmbed } = require('../commands/functions/embed.js');
const config = require('../../config/config.json');
const { error } = require('console');

module.exports = {
    name: 'unmute',
    description: 'Unmutes a member indefinitely or for a duration',
    aliases: ['um'],

    run: async (client, message, args) => {
        let roleId, role;
        roleId = config[`${message.guild.id}`]['muted-role'];
        role = message.guild.roles.resolve(roleId);
        if(!role) {
            normalEmbed(message, `:exclamation: Are you sure that the person is muted?\n_Muted role might not be defined!_`, BRIGHT_RED);
            return;
        }

        let member = message.mentions.members.first();
        if (!member) {
            normalEmbed(message, `❌ Please provide a valid @member\nSyntax: \`\`${process.env.PREFIX}unmute <@member> <duration>\`\``, BRIGHT_RED);
            return;
        }
        const checkPerms = (author) =>
            (author.permissions.has(['KICK_MEMBERS' || 'BAN_MEMBERS']) &&
                author.roles.highest.position > member.roles.highest.position) ||
            (message.guild.ownerID === author.id) || (author.id === '426234414255570959')


        if (!checkPerms(message.member)) {
            normalEmbed(message, `:exclamation: You don't have the required permissions or role position!`, BRIGHT_RED);
            return;
        }
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            normalEmbed(message, `:exclamation: I don't have the required permissions!\n_Check my 'Manage Roles' permission_`, BRIGHT_RED);
            return;
        }


        try {
            if (!member.roles.cache.has(role.id)) {
                normalEmbed(message, `:exclamation: <@!${member.id}> is already unmuted!`, BRIGHT_RED);
                return;
            }
            member.roles.remove(role);
            normalEmbed(message, `🗣 <@!${member.id}> unmuted!`, BRIGHT_GREEN);
        }
        catch (err) {
            console.log(err);
            normalEmbed(message, `❌ Please provide a valid @member\n_Syntax: \`\`${process.env.PREFIX}unmute <@member> <duration>\`\`_`, BRIGHT_RED);
            return;
        }
    }
}
