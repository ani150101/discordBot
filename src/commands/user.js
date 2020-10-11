
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'user',
    aliases: ['userinfo', 'whois', 'info'],
    description: "Displays information about a user in the server",

    execute(client, message, args) {
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
}