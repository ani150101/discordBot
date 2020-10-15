
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'kick',
    aliases: ['k'],
    description: "Kicks an existing memberID/@member from the server",

    run: async (client, message, args) => {
        if(!message.member.hasPermission('KICK_MEMBERS')) {
            if(!message.author.id === '426234414255570959') {
                normalEmbed(message, `:exclamation: You do not have Kick permission!`, BRIGHT_RED);
                return;
            }
        }
        args = message.content.substring(process.env.PREFIX.length).split(" ");
        try {
            if(args.length > 1) var memberId = args[1].match(/[0-9]+/)[0];
            if(args.length > 2) var reason = args.slice(2).join(' ');
        } catch (err) {
            normalEmbed(message, `:exclamation: Please provide a valid ID/@mention`, BRIGHT_RED);
            return;
        }
        
        // let member = message.guild.members.cache.find(Member => Member.id === memberId);
        if(memberId) {
            // let member = message.guild.members.cache.find(Member => Member.id === memberId);
            let member = message.guild.members.resolve(memberId);
            if(!member) {
                normalEmbed(message, ":x: Member not present in the server\n_Please provide a valid ID/@mention_", BRIGHT_RED);
                return;
            }
            if(!member.kickable) {
                normalEmbed(message, `:exclamation: Cannot kick <@!${memberId}>\n_Member has kick permission!_`, BRIGHT_RED);
                return;
            }
            let dm = dmEmbed(message, `Reason: \`\`${reason?reason:'No reason provided'}\`\``, `You were kicked from ${message.guild.name} Server`, false, true);
            member.send(dm).then(function(){
                member.kick(reason);
                console.log(`Successfully sent kick message to ${member.user.tag}`);
            }).catch(function(){
            member.kick(reason);
                console.log(`Could not send kick message to ${member.user.tag}`);
            });
            normalEmbed(message, `:white_check_mark: ${member.user.tag} kicked!\n**Reason:** ${reason?reason:'No reason provided'}`, BRIGHT_GREEN);
        }
        else {
            normalEmbed(message, `:x: Please include <member id/mention>\n\u200B\nSyntax: \`\`${process.env.PREFIX}kick <member> <reason>\`\``, BRIGHT_RED);
        }
    }
}