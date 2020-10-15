
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'ban',
    aliases: ['b', 'hammer', 'gtfo'],
    description: "Bans a memberID/@member in the server",

    run: async (client, message, args) => {
        if(!message.member.hasPermission('BAN_MEMBERS')) {
            if(!message.author.id === '426234414255570959') {
                normalEmbed(message, `:exclamation: You do not have Ban permission!`, BRIGHT_RED);
                return;
            }
        }
        
        args = message.content.substring(process.env.PREFIX.length).split(" ");
        try {
            if(args.length > 1) var memberId = args[1].match(/[0-9]+/)[0];
            if(args.length > 2) var reason = args.slice(2).join(' ');
        } catch (error) {
            normalEmbed(message, `:exclamation: Please provide a valid ID/@mention`, BRIGHT_RED);
            return;
        }
        
        let member = message.guild.members.cache.find(Member => Member.id === memberId);
        if(memberId) {
            // let member = message.guild.members.cache.find(Member => Member.id === memberId);
            let member = message.guild.members.resolve(memberId);
            if(member) {
                
                if(!member.bannable) {
                    normalEmbed(message, `:exclamation: Cannot ban <@!${memberId}>\n_Member has ban permission!_`, BRIGHT_RED);
                    return;
                }
                let dm = dmEmbed(message, `Reason: \`\`${reason?reason:'No reason provided'}\`\``, `You were banned from ${message.guild.name} Server`, false, true);
                member.send(dm).then(function(){
                    member.ban({reason: reason});
                    console.log(`Successfully sent ban message to ${member.user.tag}`);
                }).catch(function(){
                   member.ban({reason: reason});
                    console.log(`Could not send ban message to ${member.user.tag}`);
                });
                // normalEmbed(message, ":x: Member not present in the server", BRIGHT_RED);
            }
            else {
                message.guild.members.ban(memberId, {reason: reason});
            }
            normalEmbed(message, `:white_check_mark: ${member?member.user.tag:memberId} Banned!\n**Reason:** \`\`${reason?reason:'No reason provided'}\`\``, BRIGHT_GREEN);
        }
        else {
            normalEmbed(message, `:x: Please include <member id/mention>\n\u200B\nSyntax: \`\`${process.env.PREFIX}ban <member> <reason>\`\``, BRIGHT_RED);
        }
    }
}