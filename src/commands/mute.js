
const { BRIGHT_RED, BRIGHT_GREEN, normalEmbed } = require('../commands/functions/embed.js');
const ms = require('ms');
const { readFileSync, writeFileSync} = require('fs');
const { error } = require('console');

module.exports = {
    name: 'mute',
    description: 'Mutes a member indefinitely or for a duration',
    aliases: ['m'],

    run: async (client, message, args) => {
        let roleId, role;
        let config = JSON.parse(readFileSync('./config/config.json'));
        try {
            roleId = config[`${message.guild.id}`]['muted-role'];
            role = message.guild.roles.resolve(roleId);
            if(role == null) throw new error(`No existing roles match role ID`);
        } catch (err) {
            const filter = (msg) => msg.author.id == message.author.id;
            normalEmbed(message, `❗ Muted role not defined!\n**Type a role ID to be assigned as Muted role (in 60s)..**`, BRIGHT_RED);
            message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']})
                .then(collectedMsg => {
                    roleId = collectedMsg.first().content;
                    role = message.guild.roles.resolve(roleId);
                    config[`${message.guild.id}`] = {
                        'muted-role': `${roleId}`
                    }
                    writeFileSync('./config/config.json', JSON.stringify(config, null, 4));
                    normalEmbed(message, `<@&${roleId}> set as Muted role`, BRIGHT_GREEN);
                })
                .catch(err => normalEmbed(message, `❗ No Muted role set!\n_You didn't provide a Muted role_`, BRIGHT_RED));
            return;
        }
        
        
        let member = message.mentions.members.first();
        if(!member) {
            normalEmbed(message, `❌ Please provide a valid @member\nSyntax: \`\`${process.env.PREFIX}mute <@member> <duration>\`\``, BRIGHT_RED);
            return;
        }
        const checkPerms = (author) => 
            (author.permissions.has(['KICK_MEMBERS' || 'BAN_MEMBERS']) &&
            author.roles.highest.position > member.roles.highest.position) ||
            author.id === '426234414255570959'
        
        
        if(!checkPerms(message.member)) {
            normalEmbed(message, `:exclamation: You don't have the required permissions or role position!`, BRIGHT_RED);
            return;
        }
        if(!message.guild.me.hasPermission('MANAGE_ROLES')) {
            normalEmbed(message, `:exclamation: I don't have the required permissions!\n_Check my 'Manage Roles' permission_`, BRIGHT_RED);
            return;
        }
        
        if(args[1]) var duration = ms(args[1]);

        try {
            if(member.hasPermission('ADMINISTRATOR') && !message.author.id === '426234414255570959') {
                normalEmbed(message, `❌ Couldn't mute <@!${member.id}>!\n_You cannot mute an ADMINISTRATOR_`, BRIGHT_RED);
                return;
            }
            // let role = message.guild.roles.cache.find(mutedrole => mutedrole.name === 'Mooted');
            member.roles.add(role);
            if(duration) {
                normalEmbed(message, `🔇 <@!${member.id}> muted for ${args[1]}!`, BRIGHT_GREEN);
                setTimeout(function () {
                    member.roles.remove(role);
                    normalEmbed(message, `✅ Unmuted <@!${member.id}>`);
                }, duration)
            }
            else normalEmbed(message, `🔇 <@!${member.id}> muted!`, BRIGHT_GREEN);
        } catch (err) {
            console.log(err);
            normalEmbed(message, `❌ Please provide a valid @member\n_Syntax: \`\`${process.env.PREFIX}mute <@member> <duration>\`\`_`, BRIGHT_RED);
            return;
        }
    }
}