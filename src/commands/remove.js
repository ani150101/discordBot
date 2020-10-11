
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'remove',
    aliases: ['r', 'remrole', 'roledel', 'delrole'],
    description: "Removes a role from the user provided in args",

    execute(client, message, args) {
        let role, roleId;
        let roleArgs = message.content.substring(message.content.indexOf(' ')+1, message.content.lastIndexOf(' '));
        let { cache } = message.guild.roles;
        try {
            if(roleArgs.startsWith('<')) {
                roleId = roleArgs = roleArgs.match(/\d+/)[0];
                role = cache.find(role => role.id === roleArgs);
            }
            else {
                role = cache.find(role => role.name.toLowerCase() === roleArgs);
                roleId = role.id;
            }
        } catch (err) {
            console.log(err);
            normalEmbed(message, `:x: Wrong usage of command! \n\u200B\nSyntax: \`\`${PREFIX}remove <role name/mention> <member>\`\``, BRIGHT_RED); // Please refer to ${PREFIX}help.
            return;
        }
        const checkMemberPermissions = (member) => member.permissions.has('ADMINISTRATOR') || member.permissions.has('MANAGE_ROLES');
        
        let member = message.mentions.members.first(); //message.mentions.members.find(member => member.roles.add(role).catch(err => console.log(err)));
        //member.roles.add(role);
        if(role) {
            if(!checkMemberPermissions(message.member)) {
                normalEmbed(message, `:x: You cannot remove <@&${roleId}> role! Missing Permissions.`, BRIGHT_RED);
                return;
            }
            if(!member.roles.cache.has(role.id)) {
                normalEmbed(message, `<@!${member.id}> does not have <@&${roleId}> role!`, BRIGHT_RED);
                return;
            }
            else {
                member.roles.remove(role)
                    .then(memb => normalEmbed(message, `:white_check_mark: <@&${roleId}> role removed!`, BRIGHT_GREEN))
                    .catch(err => {
                        normalEmbed(message, ":exclamation: Missing permissions!", BRIGHT_RED);
                        return;
                    })
            }
        }
        else {
            normalEmbed(message, ":exclamation: Role does not exist!", BRIGHT_RED);
            return;
        }
    }
}