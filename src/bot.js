require('dotenv').config();
const discord = require("discord.js");  
// const { richEmbed, normalEmbed, dmEmbed } = require('../embed.js');
const client = new discord.Client();
const fs = require('fs');
client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//client.login(process.env.BOT_TOKEN).catch(err => console.log(err));
client.login(process.env.TEST_TOKEN).catch(err => console.log(err));

client.on('ready', () => {
    console.log("Baby is up..\n----------\nPREFIX: !\n\n");
    client.user.setPresence({status: 'dnd', activity: {name: 'my cutie', type: 'WATCHING'}})
        .catch(err => console.log(err));
})


client.on('message', (message) => {
    message.userManager = new discord.UserManager(client);

    if(message.author.bot || !message.content.startsWith(process.env.PREFIX)) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    if(!client.commands.has(cmdName)) return;
    const command = client.commands.get(cmdName);

    // if(client.commands.has(cmdName)) {
        command.execute(client, message, args);
    // }
})