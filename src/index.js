/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const Discord = require('discord.js');
const { Intents } = require('discord.js');
const {
  Player
} = require('discord-music-player');
const ytdl = require('ytdl-core');
const { join } = require('@discordjs/voice');
const youtubesearchapi = require('youtube-search-api');
const ytsr = require('ytsr');
const search = require('youtube-search');
const spotifySearch = require('./functions/play-spotfiy');
const musixMatch = require('./integrations/musixmatch');

const client = new Discord.Client({
  // eslint-disable-next-line no-undef
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});
// const player = new Player(client, {
//   leaveOnEmpty: false, // This options are optional.
// });

const settings = {
  prefix: '.',
  token: process.env.token,
  //token: process.env.tokenmusix
};

const port = process.env.PORT || 5000;
const queue = new Map();

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
  }
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
      serverQueue.songs.shift()
      const newQueue = { ...serverQueue };
      queue.set(guild.id, newQueue);
      if(queue.get(guild.id).songs.length) {
        play(guild, queue.get(guild.id).songs[0]);
      }
    })
    // eslint-disable-next-line no-console
    .on('error', (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.on('ready', () => {
  console.log('I am ready to Play with DMP 🎶');
});

client.login(settings.token).catch((err) => {
  console.log({ err });
});

client.on('message', async (message) => {
  if (message.channel.type === 'dm') {
    return;
  }
  
  const channel = client.channels.cache.get(message.channel.id);
  const voiceChannel = message.member.voice.channel;
  const args = message.content.split(' ');
  const prefix = args[0].split('')
  if (!message.member.voice.channel && message.author.id !== '881137071278940191' && prefix[0] === settings.prefix) { 
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  }
  const songString = args.filter((str) => str !== '.play').join(' ');
  queue.set(message.guild.id, queue.get(message.guild.id) ?? {
    textChannel: message.channel,
    voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true,
  });
  if (args[0] === `${settings.prefix}play` || args[0] === `${settings.prefix}p` ) {
    console.log(songString);
    var songStringForYt = '';
    if(songString.startsWith('https://open.spotify.com/')){
      songStringForYt = await spotifySearch(songString.trim());
    }else{
      songStringForYt = songString;
    }
    
    const searchResults = await ytsr(songStringForYt, { limit: 5 });
    const { url } = searchResults.items[0];
    console.log({ url });
    const songInfo = await ytdl.getInfo(url);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
    const queueContruct = { ...queue.get(message.guild.id) }
    if (queue.get(message.guild.id) && !queue.get(message.guild.id).songs.length) {
      queueContruct.songs.push(song);
      const connection = await voiceChannel.join();
      queueContruct.connection = connection;
      // Calling the play function to start a song
      queue.set(message.guild.id, queueContruct);
      play(message.guild, queueContruct.songs[0]);
    } else if (queue.get(message.guild.id) && queue.get(message.guild.id).songs.length) {
      const newQueue = { ...queue.get(message.guild.id) };
      newQueue.songs.push(song);
      queue.set(message.guild.id, newQueue);
      message.channel.send(`${song.title} has been added to the queue!`);
    } else {
      console.log('boop');
    }
  }
  if (args[0] === `${settings.prefix}skip`) {
    if (!queue.get(message.guild.id)?.songs?.length) {
      return message.channel.send("There is no song that I could skip!");
    }
    queue.get(message.guild.id).connection.dispatcher.end();  
  }
  if (args[0] === `${settings.prefix}q`) {
    if (!queue.get(message.guild.id)?.songs.length) {
      return message.channel.send(`No songs in queue`)
    }
    message.channel.send(`${ [ ...queue.get(message.guild.id).songs.map((song) => song.title) ] }`);
  }
  if (args[0] === `${settings.prefix}lyrics`) {
    const user = '323413069633945603'
    if (!queue.get(message.guild.id)?.songs.length) {
      return message.channel.send(`No songs in queue`)
    }
    return message.channel.send(await musixMatch(queue.get(message.guild.id).songs[0].title));
  }
});
