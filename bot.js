require('dotenv').config();
const discord = require("discord.js");
const client = new discord.Client();
const PREFIX = process.env.PREFIX;

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log("Baby is up..\n----------\nPrefix: !\n\n");
    discord
})

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName);
const checkRolePermissions = (role) => role.permissions.has('ADMINISTRATOR');

client.on('message', (message) => {
    if(message.author.bot) return;
    if(isValidCommand(message, "hello")) {
        message.channel.send(`Hello ${message.author.username}`);
    }
    else if(isValidCommand(message, "add")){
        let args = new Set(message.content.toLowerCase().substring(5).split(',')); //can be changed
        let roleNames = new Set();
        args.forEach(rolename => {
            roleNames.add(rolename.trim());
        });
        //console.log(roles);
        let { cache } = message.guild.roles;
        roleNames.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName.trim());
            //console.log(message.member.roles.cache.has(role.id));
            if(role) {
                if(message.member.roles.cache.has(role.id)) {
                    message.channel.send(`You already have ${roleName} role!`);
                    return;
                }
                if(checkRolePermissions(role)) {
                    message.channel.send(`You cannot add ${roleName} role!`);
                    return;
                }
                else {
                    message.member.roles.add(role)
                        .then(message.channel.send(`${roleName} Role added!`))
                        .catch( err => {
                            console.log(err);
                            message.channel.send("Missing permissions!");
                        });
                }

            }
            else {
                message.channel.send(`${roleName} does not exist!`);
                return;
            }
        });
    }
})