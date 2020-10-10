require('dotenv').config();
const discord = require("discord.js");  
const { richEmbed, normalEmbed, dmEmbed } = require('./embed.js');
const client = new discord.Client();
const userManager = new discord.UserManager(client);
const PREFIX = process.env.PREFIX;
const BRIGHT_RED = '#ed0909'
const BRIGHT_GREEN = '#03b500'
//client.login(process.env.BOT_TOKEN).catch(err => console.log(err));
client.login(process.env.TEST_TOKEN).catch(err => console.log(err));
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
                {name: `avatar`, value: `Gets a Discord User's tag & avatar.\n\`\`${PREFIX}avatar <discord ID/@mention>\`\``, inline: false},
                {name: `mute`, value: `Mutes a member in the server.\n\`\`${PREFIX}mute <member> <time> <reason>\`\``, inline: false},
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
        let userFields;
        const userInfoEmbed = (user, message) => {
            let createdDate = `${user.user.createdAt.toDateString().substring(4)}`;
            let joinedDate = `${user.guild.joinedAt.toDateString().substring(4)}`;
            // let lastMessage = `${user.lastMessage.createdAt.toDateString().substring(4)}`;
            let activities = user.presence.activities[0];
            let presence = () => {
                let arr = new Array();
                try {
                    (user.presence.clientStatus.desktop)?arr.push('Desktop'):false;
                    (user.presence.clientStatus.mobile)?arr.push('Mobile'):false;
                    (user.presence.clientStatus.web)?arr.push('Web'):false;
                    return arr;
                } catch (err) {
                    arr.push('Offline');
                }
            };
                userFields = [
                    {name: 'ID', value: user.user.id, inline: false},
                    {name: 'Nickname', value: (user.nickname)?user.nickname:'None set', inline: false},
                    // {name: '\u200B', value: '\u200B', inline: true},
                    {name: 'Presence', value: presence().toString()?presence().toString():'None', inline: true},
                    {name: 'Status', value: user.presence.status, inline: true},
                    {name: 'Highest Role', value: user.roles.highest.toString(), inline: false}, 
                    // {name: '\u200B', value: '\u200B', inline: true},
                    {name: 'Created', value: createdDate, inline: true},
                    {name: 'Joined', value: joinedDate, inline: true},  
                ]
            if(activities) {
                activityType = activities.type.charAt(0) + activities.type.toLowerCase().slice(1); //Capitalize
                if(activities.details) {
                    if(activities.state) userFields.push({name: `${activityType} ${activities.name}`, value: `${activities.details}, ${activities.state}`, inline: false})
                    else userFields.push({name: `${activityType} ${activities.name}`, value: activities.details, inline: false})
                }
                else userFields.push({name: `${activityType} ${activities.name}`, value: '\u200B', inline: false});
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

    else if(isValidCommand(message, "avatar")) {
        let args = message.content.substring(PREFIX.length).split(" ");
        let memberId = args[1]; 
        
        try {
            if(memberId.startsWith('<')) memberId = memberId.slice(3,-1);
            if(memberId.length < 18 || memberId.search(/[a-z]/i) > -1) {
                normalEmbed(message, `Please provide a valid ID (18-digit number)\n\u200B\nSyntax: \`\`${PREFIX}avatar <discord user ID>\`\``, )
                return;
            }
            else {
                userManager.fetch(memberId, false, true)
                    .then(response => {
                        richEmbed(message, false, `${response.tag} (${memberId})`, false, false, false, false, 'RANDOM', response.displayAvatarURL({format: 'png', dynamic: true, size: 4096}));
                    })
                    .catch(err => {
                        normalEmbed(message, `${memberId} does not match a Discord User.`);
                        return;
                    });
            }
        } catch (err) {
            normalEmbed(message, `Please provide ID as an argument (18-digit number)\n\u200B\nSyntax: \`\`${PREFIX}avatar <discord user ID>\`\``);
            return;
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
        let args = message.content.substring(PREFIX.length).split(" ");
        if(args.length > 1) var memberId = args[1].match(/[0-9]+/)[0];
        if(args.length > 2) var reason = args.slice(2).join(' ');
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
            let dm = dmEmbed(message, member, `Reason: \`\`${reason?reason:'No reason provided'}\`\``, `You were kicked from ${message.guild.name} Server`, false, true);
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
            normalEmbed(message, `:x: Please include <member id/mention>\n\u200B\nSyntax: \`\`${PREFIX}kick <member> <reason>\`\``, BRIGHT_RED);
        }
    }

    else if(isValidCommand(message, "ban")) {
        let args = message.content.substring(PREFIX.length).split(" ");
        try {
            if(args.length > 1) var memberId = args[1].match(/[0-9]+/)[0];
            if(args.length > 2) var reason = args.slice(2).join(' ');
        } catch (error) {
            normalEmbed(message, `:exclamation: Please provide a valid ID/@mention`, BRIGHT_RED);
            return;
        }
        
        // let member = message.guild.members.cache.find(Member => Member.id === memberId);
        if(memberId) {
            // let member = message.guild.members.cache.find(Member => Member.id === memberId);
            let member = message.guild.members.resolve(memberId);
            if(member) {
                if(!member.bannable) {
                    normalEmbed(message, `:exclamation: Cannot ban <@!${memberId}>\n_Member has ban permission!_`, BRIGHT_RED);
                    return;
                }
                let dm = dmEmbed(message, member, `Reason: \`\`${reason?reason:'No reason provided'}\`\``, `You were banned from ${message.guild.name} Server`, false, true);
                member.send(dm).then(function(){
                    // member.ban({reason: reason});
                    console.log(`Successfully sent ban message to ${member.user.tag}`);
                }).catch(function(){
                //    member.ban({reason: reason});
                    console.log(`Could not send ban message to ${member.user.tag}`);
                });
                // normalEmbed(message, ":x: Member not present in the server", BRIGHT_RED);
            }
            else {
                message.guild.members.ban(memberId, {reason: reason});
            }
            normalEmbed(message, `:white_check_mark: ${member?member.user.tag:memberId} Banned!\n**Reason:** \`\`${reason?reason:'No reason provided'}\`\``, BRIGHT_GREEN);
        }
        else {
            normalEmbed(message, `:x: Please include <member id/mention>\n\u200B\nSyntax: \`\`${PREFIX}ban <member> <reason>\`\``, BRIGHT_RED);
        }
    }
})
