const { default: Musicmatch } = require("musicmatch");
const Musixmatch = require("musixmatch");
require('dotenv').config()

music = require('musicmatch')({apikey: process.env.TOKENMUSIX});

async function lyrics(trackId) {
    let string;
    try {
        string = (await music.trackLyrics({track_id:trackId})).message.body.lyrics.lyrics_body;
        return string;
    } catch (error) {
        console.log(error);
    }
}

async function musixMatch(title) {
    let string;
    try {
        string = (await music.matcherTrack({q_track:title, page:1, page_size:999, f_has_lyrics: true})).message.body.track.track_id ? await lyrics((await music.matcherTrack({q_track:title, page:1, page_size:999, f_has_lyrics: true})).message.body.track.track_id) : 'no available lyrics';
        return string
    } catch (error) {
        console.log(error)
    }
}

module.exports = musixMatch;
