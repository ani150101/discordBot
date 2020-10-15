
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'unban',
    aliases: ['ub'],
    description: "Unbans a memberID/@member in the server",

    run: async (client, message, args) => {
        if(!message.member.hasPermission('BAN_MEMBERS')) {
            normalEmbed(message, `:exclamation: You do not have Ban permission!`, BRIGHT_RED);
            return;
        }
    
        let userId = args.shift();;
        let reason = args.join(" ");
    
        if(!userId) {
            normalEmbed(message, `:x: Wrong usage of command! \n\u200B\nSyntax: \`\`${process.env.PREFIX}unban <memberID/username> <reason>\`\``, BRIGHT_RED);
            return;
        }
        
        if(userId.match(/\d+/g) && (userId.search(/[a-z]/i) < 0) && !userId.includes('#')) {
            if(userId.length != 18) {
                normalEmbed(message, `Please provide a valid ID (18-digit number)`,BRIGHT_RED);
                return;
            }
            message.guild.fetchBan(userId)
                .then(member => {
                    let memberId = member.user.id;
                    message.guild.members.unban(memberId, reason);
                    normalEmbed(message, `:white_check_mark: ${member?member.user.tag:memberId} Unbanned!\n\u200B\n**Reason:** \`\`${reason?reason:'No reason provided'}\`\``, BRIGHT_GREEN);
                }).catch(err => {
                    normalEmbed(message, `:exclamation: Cannot unban userID: **${userId}**\n_Does not match a banned user!_`, BRIGHT_RED);
                    return;
                })
        }
        // console.log(userId);
        else if(userId.match(/[a-z]/i) && !userId.includes('#')) { // /[a-z]+#[0-9]+/i
            message.guild.fetchBans()
                .then(member => {
                    member = member.filter(mem => mem.user.username.toLowerCase() === userId.toLowerCase());
                    if(member.size < 2) {
                        member = member.first();    
                        message.guild.members.unban(member.user.id, reason);
                        normalEmbed(message, `:white_check_mark: **${member?member.user.tag:memberId}** Unbanned!\n\u200B\n**Reason:** \`\`${reason?reason:'No reason provided'}\`\``, BRIGHT_GREEN);
                        return;
                    }
                    normalEmbed(message, `:exclamation: More than 1 user with the username: **${userId}**\n_Please include the discriminator (example#1234)_`, BRIGHT_RED);
                    message.guild.members.unban(member.user.id, reason);
                    normalEmbed(message, `:white_check_mark: **${member?member.user.tag:memberId}** Unbanned!\n\u200B\n**Reason:** \`\`${reason?reason:'No reason provided'}\`\``, BRIGHT_GREEN);
                }).catch(err => {
                    console.log(err);
                    normalEmbed(message, `:exclamation: Cannot unban username: **${userId}**\n_Does not match a banned user!_`, BRIGHT_RED);
                    return;
                });
        }
    
        else if(userId.match(/[a-z]+#[0-9]+/i)) {
            userId = userId.split('#');
            let userName = userId.shift();
            let discrim = userId.shift();
            if(discrim.length != 4) {
                 normalEmbed(message, `:exclamation: Discriminator should be a 4-digit number`, BRIGHT_RED);
                 return;
            }
    
            message.guild.fetchBans()
                .then(member => {
                    member = member.find(mem => mem.user.username.toLowerCase() === userName.toLowerCase() && mem.user.discriminator === discrim);
                    message.guild.members.unban(member.user.id, reason);
                    normalEmbed(message, `:white_check_mark: **${member?member.user.tag:memberId}** Unbanned!\n\u200B\n**Reason:** \`\`${reason?reason:'No reason provided'}\`\``, BRIGHT_GREEN);
    
                }).catch(err => {
                    console.log(err);
                    normalEmbed(message, `:exclamation: Cannot unban **${userName}#${discrim}**\n_Does not match a banned user!_`, BRIGHT_RED);
                    return;
                });
        }
    }
}