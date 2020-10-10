const discord = require('discord.js');
const richEmbed = (message, description, title, titleUrl, authorBool, thumbnailUrl, fields, color, imageUrl) => {
    let embed = new discord.MessageEmbed();
    embed.setFooter('Developed by Robot & Coco', message.guild.iconURL());
    embed.setTimestamp();
    if(authorBool) embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    if(description) embed.setDescription(description);
    if(title) embed.setTitle(title);
    if(titleUrl) embed.setURL(titleurl);
    if(thumbnailUrl) embed.setThumbnail(thumbnailUrl);
    if(fields) embed.addFields(fields);
    if(color) {embed.setColor(color);}
    else {embed.setColor("#b33030");}
    if(imageUrl) embed.setImage(imageUrl);
    message.channel.send(embed);
};
const normalEmbed = (message, description, color, title, titleUrl) => {
    let embed = new discord.MessageEmbed();
    if(description) embed.setDescription(description);
    if(color) {embed.setColor(color);}
    else {embed.setColor("#b33030");}
    if(title) embed.setTitle(title);
    if(titleUrl) embed.setURL(titleurl);
    message.channel.send(embed);
}
const dmEmbed = (message, member, description, title, titleUrl, authorBool, thumbnailUrl, fields, color, imageUrl) => {
    let embed = new discord.MessageEmbed();
    embed.setFooter('Developed by Robot & Coco', message.guild.iconURL());
    embed.setTimestamp();
    if(authorBool) embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    if(description) embed.setDescription(description);
    if(title) embed.setTitle(title);
    if(titleUrl) embed.setURL(titleurl);
    if(thumbnailUrl) embed.setThumbnail(thumbnailUrl);
    if(fields) embed.addFields(fields);
    if(color) {embed.setColor(color);}
    else {embed.setColor("#b33030");}
    if(imageUrl) embed.setImage(imageUrl);
    return embed;
};

module.exports = {
    richEmbed,
    normalEmbed,
    dmEmbed,
};