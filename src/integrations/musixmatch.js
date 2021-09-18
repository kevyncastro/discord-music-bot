const { default: Musicmatch } = require("musicmatch");
const Musixmatch = require("musixmatch");

music = require('musicmatch')({apikey: process.env.TOKENMUSIX});

async function lyrics(trackId) {
try {

    return await (music.trackLyrics({track_id:trackId})).message.body.lyrics.lyrics_body
    
} catch (error) {
    console.log(error);
}

}
async function musixMatch(trackId) {
try {
    console.log(trackId);
    return lyrics((await music.trackSearch({q:trackId, page:1, page_size:3})).message.body.track_list[0].track.track_id)
    
} catch (error) {
    console.log(error)
}
}

module.exports = musixMatch;