
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'avatar',
    aliases: ['pfp', 'dp', 'search'],
    description: "Replies with hello back",

    execute(client, message, args) {
        // let args = message.content.substring(process.env.PREFIX.length).split(" ");
        // console.log(args);
        let memberId = args[0]; 
        console.log(memberId)
        try {
            if(memberId.startsWith('<')) memberId = memberId.slice(3,-1);

            if(memberId.length < 18 || memberId.search(/[a-z]/i) > -1) {
                normalEmbed(message, `Please provide a valid ID (18-digit number)\n\u200B\nSyntax: \`\`${process.env.PREFIX}avatar <discord user ID>\`\``)
                return;
            }
            else {
                message.userManager.fetch(memberId, false, true)
                    .then(response => {
                        richEmbed(message, false, `${response.tag} (${memberId})`, false, false, false, false, 'RANDOM', response.displayAvatarURL({format: 'png', dynamic: true, size: 4096}));
                    })
                    .catch(err => {
                        normalEmbed(message, `${memberId} does not match a Discord User.`);
                        return;
                    });
            }
        } catch (err) {
            console.log(err);
            normalEmbed(message, `Please provide ID as an argument (18-digit number)\n\u200B\nSyntax: \`\`${process.env.PREFIX}avatar <discord user ID>\`\``);
            return;
        }
    }
}