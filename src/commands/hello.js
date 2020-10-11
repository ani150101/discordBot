
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'hello',
    aliases: ['hi', 'hole'],
    description: "Replies with hello back",

    execute(client, message, args) {

        richEmbed(message, `Hello <@!${message.author.id}>`, "HOLA!", false, true, false);
    }
}