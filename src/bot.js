require('dotenv').config();
const discord = require("discord.js");  
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('./commands/functions/embed.js'); ///////// ENABLE WHILE TESTING ///////////
const client = new discord.Client();
const fs = require('fs');
client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
// client.login(process.env.BOT_TOKEN).catch(err => console.log(err));
client.login(process.env.TEST_TOKEN).catch(err => console.log(err));



client.on('ready', () => {
    console.log("Baby is up..\n----------\nPREFIX: !\n\n");
    client.user.setPresence({status: 'dnd', activity: {name: 'my pp', type: 'WATCHING'}})
        .catch(err => console.log(err));
})

client.on('guildCreate', (guild) => {
    console.log(guild.name);
    guild.roles.create({data: 
        {
            name: 'Muted', 
            position: 1, 
            permissions: ['READ_MESSAGE_HISTORY'],
        }
    })  .then(role => {
            let config = JSON.parse(fs.readFileSync('./config/config.json').toString());
            config[`${guild.id}`] = {
                'muted-role': `${role.id}`
            }
            fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 4));
            console.log(`Muted role created. Overwriting channel permissions...`);
            guild.channels.cache.forEach(channel => {
                channel.createOverwrite(role, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: true,
                    ADD_REACTIONS: false, 
                    CONNECT: false,
                    MENTION_EVERYONE: false,
                    MANAGE_ROLES: false,
                    SEND_TTS_MESSAGES: false,
                }).catch(e => {});
                console.log(`${channel.name} permissions updated.`);
            })
    })
        .catch(err=> console.log(`Couldn't create Muted role`, err));
})


client.on('message', (message) => {
    message.userManager = new discord.UserManager(client);

    if(message.author.bot || !message.content.startsWith(process.env.PREFIX)) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    ////////////////////////////////////////////////////////// COMMENT THESE 3 LINES BELOW ////////////////////////////////////////////////////////////////////

    const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if(!command) return;
    command.run(client, message, args);

    //////////////////////////////////////////////////////////// TESTING COMMANDS BELOW ///////////////////////////////////////////////////////////////////////

    
    // fs.writeFileSync('./config/config.json', JSON.stringify(obj, null, 4));   

})
