
    
    //Add roles command
    // else if(isValidCommand(message, "add")){
    //     let args = new Set(message.content.toLowerCase().substring(5).split(',')); //can be changed
    //     let roleNames = new Set();
    //     args.forEach(rolename => {
    //         roleNames.add(rolename.trim());
    //     });
    //     //console.log(roles);
    //     let { cache } = message.guild.roles;
    //     console.log(cache);
    //     roleNames.forEach(roleName => {
    //         let role = cache.find(role => role.name.toLowerCase() === roleName.trim());
    //         //console.log(message.member.roles.cache.has(role.id));
    //         if(role) {
    //             if(message.member.roles.cache.has(role.id)) {
    //                 message.channel.send(`You already have ${roleName} role!`);
    //                 return;
    //             }
    //             if(checkRolePermissions(role)) {
    //                 message.channel.send(`You cannot add ${roleName} role!`);
    //                 return;
    //             }
    //             else {
    //                 message.member.roles.add(role)
    //                     .then(message.channel.send(`${roleName} Role added!`))
    //                     .catch( err => {
    //                         console.log(err);
    //                         message.channel.send("Missing permissions!");
    //                     });
    //             }

    //         }
    //         else {
    //             message.channel.send(`${roleName} does not exist. Please specify a valid role!`);
    //             return;
    //         }
    //     });
    // }

    ///////////////////////////////////////////////////////Remove roles command/////////////////////////////////////////////
    // else if(isValidCommand(message, "del")){
    //     let args = new Set(message.content.toLowerCase().substring(5).split(',')); //can be changed
    //     let roleNames = new Set();
    //     args.forEach(rolename => {
    //         roleNames.add(rolename.trim());
    //     });
    //     //console.log(roles);
    //     let { cache } = message.guild.roles;
    //     roleNames.forEach(roleName => {
    //         let role = cache.find(role => role.name.toLowerCase() === roleName.trim());
    //         //console.log(message.member.roles.cache.has(role.id));
    //         if(role) {
    //             if(!message.member.roles.cache.has(role.id)) {
    //                 message.channel.send(`You don't have ${roleName} role!`);
    //                 return;
    //             }
    //             else {
    //                 message.member.roles.remove(role)
    //                     .then(member => message.channel.send(`${roleName} Role removed!`))
    //                     .catch( err => {
    //                         console.log(err);
    //                         message.channel.send("Missing permissions!");
    //                     });
    //             }

    //         }
    //         else {
    //             message.channel.send(`${roleName} does not exist!`);
    //             return;
    //         }
    //     });
    // }


    module.exports = {
        async play(song, message) {
          const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
          const queue = message.client.queue.get(message.guild.id);
      
          if (!song) {
            queue.channel.leave();
            message.client.queue.delete(message.guild.id);
            return queue.textChannel.send("🚫 Music queue ended.").catch(console.error);
          }
      
          let stream = null;
          let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
      
          try {
            if (song.url.includes("youtube.com")) {
              stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
            } else if (song.url.includes("soundcloud.com")) {
              try {
                stream = await scdl.downloadFormat(
                  song.url,
                  scdl.FORMATS.OPUS,
                  SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined
                );
              } catch (error) {
                stream = await scdl.downloadFormat(
                  song.url,
                  scdl.FORMATS.MP3,
                  SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined
                );
                streamType = "unknown";
              }
            }
          } catch (error) {
            if (queue) {
              queue.songs.shift();
              module.exports.play(queue.songs[0], message);
            }
      
            console.error(error);
            return message.channel.send(`Error: ${error.message ? error.message : error}`);
          }
      
          queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
      
          const dispatcher = queue.connection
            .play(stream, { type: streamType })
            .on("finish", () => {
              if (collector && !collector.ended) collector.stop();
      
              if (queue.loop) {
                // if loop is on, push the song back at the end of the queue
                // so it can repeat endlessly
                let lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports.play(queue.songs[0], message);
              } else {
                // Recursively play the next song
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
              }
            })
            .on("error", (err) => {
              console.error(err);
              queue.songs.shift();
              module.exports.play(queue.songs[0], message);
            });
          dispatcher.setVolumeLogarithmic(queue.volume / 100);
      
          try {
            var playingMessage = await queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url}`);
            await playingMessage.react("⏭");
            await playingMessage.react("⏯");
            await playingMessage.react("🔇");
            await playingMessage.react("🔉");
            await playingMessage.react("🔊");
            await playingMessage.react("🔁");
            await playingMessage.react("⏹");
          } catch (error) {
            console.error(error);
          }
      
          const filter = (reaction, user) => user.id !== message.client.user.id;
          var collector = playingMessage.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
          });
      
          collector.on("collect", (reaction, user) => {
            if (!queue) return;
            const member = message.guild.member(user);
      
            switch (reaction.emoji.name) {
              case "⏭":
                queue.playing = true;
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                queue.connection.dispatcher.end();
                queue.textChannel.send(`${user} ⏩ skipped the song`).catch(console.error);
                collector.stop();
                break;
      
              case "⏯":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                if (queue.playing) {
                  queue.playing = !queue.playing;
                  queue.connection.dispatcher.pause(true);
                  queue.textChannel.send(`${user} ⏸ paused the music.`).catch(console.error);
                } else {
                  queue.playing = !queue.playing;
                  queue.connection.dispatcher.resume();
                  queue.textChannel.send(`${user} ▶ resumed the music!`).catch(console.error);
                }
                break;
      
              case "🔇":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                if (queue.volume <= 0) {
                  queue.volume = 100;
                  queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
                  queue.textChannel.send(`${user} 🔊 unmuted the music!`).catch(console.error);
                } else {
                  queue.volume = 0;
                  queue.connection.dispatcher.setVolumeLogarithmic(0);
                  queue.textChannel.send(`${user} 🔇 muted the music!`).catch(console.error);
                }
                break;
      
              case "🔉":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                if (queue.volume - 10 <= 0) queue.volume = 0;
                else queue.volume = queue.volume - 10;
                queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
                queue.textChannel
                  .send(`${user} 🔉 decreased the volume, the volume is now ${queue.volume}%`)
                  .catch(console.error);
                break;
      
              case "🔊":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                if (queue.volume + 10 >= 100) queue.volume = 100;
                else queue.volume = queue.volume + 10;
                queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
                queue.textChannel
                  .send(`${user} 🔊 increased the volume, the volume is now ${queue.volume}%`)
                  .catch(console.error);
                break;
      
              case "🔁":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                queue.loop = !queue.loop;
                queue.textChannel.send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`).catch(console.error);
                break;
      
              case "⏹":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                queue.songs = [];
                queue.textChannel.send(`${user} ⏹ stopped the music!`).catch(console.error);
                try {
                  queue.connection.dispatcher.end();
                } catch (error) {
                  console.error(error);
                  queue.connection.disconnect();
                }
                collector.stop();
                break;
      
              default:
                reaction.users.remove(user).catch(console.error);
                break;
            }
          });
      
          collector.on("end", () => {
            playingMessage.reactions.removeAll().catch(console.error);
            if (PRUNING && playingMessage && !playingMessage.deleted) {
              playingMessage.delete({ timeout: 3000 }).catch(console.error);
            }
          });
        }
      };