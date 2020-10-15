
const { normalEmbed, richEmbed } = require('./functions/embed.js');

module.exports = {
    name: 'ping',
    aliases: [],
    description: "Replies with the API ping back",

    run: async (client, message, args) => {

        // normalEmbed(message, `⌛ Latency: ${Date.now() - message.createdTimestamp}ms`, 'RANDOM', "PONG!");
        normalEmbed(message, `⌛ Latency: ${client.ws.ping}ms`, 'RANDOM', "PONG!");
    }
}