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
   await music.trackSearch({q:"Chet Faker - Gold", page:1, page_size:3})
	.then(async function(data){
        console.log(data.message.body.track_list[0].track.track_id);
		await lyrics(data.message.body.track_list[0].track.track_id);
	}).catch(function(err){
		console.log(err);
})
}
module.exports = musixMatch;