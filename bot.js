require('dotenv').config();
const discord = require("discord.js");
const { richEmbed, normalEmbed } = require('./embed.js');
const client = new discord.Client();
const PREFIX = process.env.PREFIX;
const BRIGHT_RED = '#ed0909'
const BRIGHT_GREEN = '#03b500'
//client.login(process.env.BOT_TOKEN).catch(err => console.log(err));
client.login(process.env.TEST_TOKEN).catch(err => console.log(err));
// client.user.setActivity({activity: {name: `babies`}, status: 'dnd'})
//     .then(console.log("why"))
//     .catch(console.log("why"));
client.on('ready', () => {
    console.log("Baby is up..\n----------\nPrefix: !\n\n");
    client.user.setPresence({status: 'dnd', activity: {name: 'my cutie', type: 'WATCHING'}})
        .catch(err => console.log(err));
})

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName);
const checkMemberPermissions = (member) => member.permissions.has('ADMINISTRATOR') || member.permissions.has('MANAGE_ROLES');

client.on('message', (message) => {
    //console.log(message.content.match(/[0-9]+/)[0]);
    if(message.author.bot) return;
    if(isValidCommand(message, "hello")) {
        richEmbed(message, `Hello <@!${message.author.id}>`, "HOLA!", false, true, false);
    }
    else if(isValidCommand(message, "secret")) {
        try {
            let { cache } = message.guild.members;
            let robot = cache.find(member => member.user.username === "Mr. Robot");
            let coco = cache.find(member => member.user.username === "Coco");
            richEmbed(message, `<@!${robot.user.id}> loves his baby <@!${coco.user.id}> a lot!!`, 'SHHHHH!!!', false);
        } catch (error) {
            console.log(error);
            richEmbed(message, 'We need the Bigg Boss for revealing the secret!');
        }
    }

    else if(isValidCommand(message, 'help')) {
        const helpEmbed = (message) => {
            let helpFields = [
                // {name: `help`, value: `Get a list of bot commands.\n\`\`${PREFIX}help\`\``, inline: false},
                {name: `add, a`, value: `Add a role to a user.\n\`\`${PREFIX}add <role name/mention> <member>\`\``, inline: false},
                {name: `remove, r`, value: `Remove a role from user.\n\`\`${PREFIX}remove <role name/mention> <member>\`\``, inline: false},
                {name: `user`, value: `Gets a user's information.\n\`\`${PREFIX}user / ${PREFIX}user <member>\`\``, inline: false},
                {name: `mute`, value: `Mutes a member in the server.\n\`\`${PREFIX}ban <member> <time> <reason>\`\``, inline: false},
                {name: `unmute`, value: `Unmutes a member in the server.\n\`\`${PREFIX}ban <member>\`\``, inline: false},
                {name: `kick`, value: `Kick a member from the server.\n\`\`${PREFIX}kick <member> <reason>\`\``, inline: false},
                {name: `ban`, value: `Bans a member from the server.\n\`\`${PREFIX}ban <member> <reason>\`\``, inline: false},
            ]
            richEmbed(message, false, "List of Bot Commands", false, true, message.guild.iconURL(), helpFields, 'BLUE');
        }
        helpEmbed(message);
    }

    else if(isValidCommand(message, "user")) {
        let user;

        const userInfoEmbed = (user, message) => {
            let createdDate = `${user.user.createdAt.toDateString().substring(4)}`;
            let joinedDate = `${user.guild.joinedAt.toDateString().substring(4)}`;
            // let lastMessage = `${user.lastMessage.createdAt.toDateString().substring(4)}`;
            let activities = user.presence.activities[0];
            let presence = () => {
                let arr = new Array();
                    (user.presence.clientStatus.desktop)?arr.push('Desktop'):false;
                    (user.presence.clientStatus.mobile)?arr.push('Mobile'):false;
                    (user.presence.clientStatus.web)?arr.push('Web'):false;
                    return arr;
            };
            //console.log(user.presence.clientStatus);
            let userFields = [
                {name: 'ID', value: user.user.id, inline: true},
                {name: 'Nickname', value: (user.nickname)?user.nickname:'\u200B', inline: true},
                {name: '\u200B', value: '\u200B', inline: true},
                {name: 'Presence', value: presence().toString(), inline: true},
                {name: 'Status', value: user.presence.status, inline: true},
                {name: '\u200B', value: '\u200B', inline: true},
                {name: 'Created', value: createdDate, inline: true},
                {name: 'Joined', value: joinedDate, inline: true},
                {name: 'Highest Role', value: user.roles.highest.toString(), inline: true},   
            ]
            if(activities) {
                activityType = activities.type.charAt(0) + activities.type.toLowerCase().slice(1); //Capitalize
                if(activities.details) {
                    if(activities.state) userFields.push({name: `${activityType} ${activities.name}`, value: `${activities.details}, ${activities.state}`})
                    else userFields.push({name: `${activityType} ${activities.name}`, value: activities.details})
                }
                else userFields.push({name: `${activityType} ${activities.name}`, value: '\u200B'});
            }
            richEmbed(message, `<@!${user.user.id}> (${user.user.tag})`,false, false, true, user.user.displayAvatarURL(), userFields);
        };

        if(user = message.mentions.members.first()) {
            user = message.mentions.members.first();
            userInfoEmbed(user, message);
        }
        else {
            user = message.member;    //message.guild.members.cache.find(member => member.user.id === message.author.id);
            userInfoEmbed(user, message);
        }
    }

    else if(isValidCommand(message, "add") || isValidCommand(message, "a")) {
        let role, roleId;
        let roleArgs = message.content.substring(message.content.indexOf(' ')+1, message.content.lastIndexOf(' '));
        let { cache } = message.guild.roles;
        try {
            if(roleArgs.startsWith('<')) {
                roleId = roleArgs = roleArgs.match(/\d+/)[0];
                role = cache.find(role => role.id === roleArgs);
            }
            else {
                role = cache.find(role => role.name.toLowerCase() === roleArgs);
                roleId = role.id;
            }
        } catch (err) {
            console.log(err);
            normalEmbed(message, `:x: Wrong usage of command! \n\u200B\nSyntax: \`\`${PREFIX}add <role name/mention> <member>\`\``, BRIGHT_RED); // Please refer to ${PREFIX}help.
            return;
        }
        let member = message.mentions.members.first(); //message.mentions.members.find(member => member.roles.add(role).catch(err => console.log(err)));
        //member.roles.add(role);
        if(role) {
            if(!checkMemberPermissions(message.member)) {
                normalEmbed(message, `:x: You cannot add <@&${roleId}> role! Missing Permissions.`, BRIGHT_RED);
                return;
            }
            if(member.roles.cache.has(role.id)) {
                normalEmbed(message, `<@!${member.id}> already has <@&${roleId}> role!`, BRIGHT_RED);
                return;
            }
            else {
                member.roles.add(role)
                    .then(memb => normalEmbed(message, `:white_check_mark: <@&${roleId}> role added!`, BRIGHT_GREEN))
                    .catch(err => {
                        normalEmbed(message, ":exclamation: Missing permissions!", BRIGHT_RED);
                        return;
                    })
            }
        }
        else {
            normalEmbed(message, ":exclamation: Role does not exist!", BRIGHT_RED);
            return;
        }
    }

    else if(isValidCommand(message, "remove") || isValidCommand(message, "r")) {
        let role, roleId;
        let roleArgs = message.content.substring(message.content.indexOf(' ')+1, message.content.lastIndexOf(' '));
        let { cache } = message.guild.roles;
        try {
            if(roleArgs.startsWith('<')) {
                roleId = roleArgs = roleArgs.match(/\d+/)[0];
                role = cache.find(role => role.id === roleArgs);
            }
            else {
                role = cache.find(role => role.name.toLowerCase() === roleArgs);
                roleId = role.id;
            }
        } catch (err) {
            console.log(err);
            normalEmbed(message, `:x: Wrong usage of command! \n\u200B\nSyntax: \`\`${PREFIX}remove <role name/mention> <member>\`\``, BRIGHT_RED); // Please refer to ${PREFIX}help.
            return;
        }
        let member = message.mentions.members.first(); //message.mentions.members.find(member => member.roles.add(role).catch(err => console.log(err)));
        //member.roles.add(role);
        if(role) {
            if(!checkMemberPermissions(message.member)) {
                normalEmbed(message, `:x: You cannot remove <@&${roleId}> role! Missing Permissions.`, BRIGHT_RED);
                return;
            }
            if(!member.roles.cache.has(role.id)) {
                normalEmbed(message, `<@!${member.id}> does not have <@&${roleId}> role!`, BRIGHT_RED);
                return;
            }
            else {
                member.roles.remove(role)
                    .then(memb => normalEmbed(message, `:white_check_mark: <@&${roleId}> role removed!`, BRIGHT_GREEN))
                    .catch(err => {
                        normalEmbed(message, ":exclamation: Missing permissions!", BRIGHT_RED);
                        return;
                    })
            }
        }
        else {
            normalEmbed(message, ":exclamation: Role does not exist!", BRIGHT_RED);
            return;
        }
    }
    else if(isValidCommand(message, "kick")) {
        let memberID;
        let args = message.content.split(' ')[1];
        if(args) {
            if(message.mentions.members.first()) { //!kick @coco
                memberID = message.mentions.members.first().id;
                
            }
            else if(parseInt(args)) { //!kick 9012381239939
                memberID = args[1];
            }
            else {
                normalEmbed(message, ":x: Invalid member!");
            }
        }
        else {
            normalEmbed(message, ":x: Please include a member name/id/mention!");
        }
    }
})
