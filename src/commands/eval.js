
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'eval',
    description: 'Runs a custom Discord.js command in the channel',
    aliases: ['run', 'e'],

    run: async (client, message, args) => {
        if(message.author.id !== '426234414255570959') {
            message.channel.send('SHHH!!!! 😶');
            return;
        }
        
        try {
            await eval(args.join(' ').replace(/```/g, ''));
            // message.channel.send(`Output: ${data}`);
        } catch (err) {}
    }
}