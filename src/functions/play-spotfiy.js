/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const spotifyApi = require('../integrations/spotify');

const spotifySearch = async (searchString) => {
  const spotifyLink = 'https://open.spotify.com/';
  if (searchString.startsWith(spotifyLink)) {
    if (searchString.startsWith(`${spotifyLink}track/`)) {
      console.log(`${spotifyLink}track/`);
      const trackId = searchString.replace(`${spotifyLink}track/`, "").split('?')[0];
      console.log("temp track id", trackId);
      try{
        const data = await spotifyApi.getTrack(trackId);
        console.log(data);
        console.log(data.body.artists);
        console.log(data.body.name);
        let searchStringForYt = `${data.body.name} ${data.body.artists[0].name}`;
        console.log("searchString", searchStringForYt);
        return searchStringForYt;
      }
      catch(e){
        console.log("spotify get track error", e);
        throw e;
      }
    }
    else if (searchString.startsWith(`${spotifyLink}album/`)) {
      console.log(`${spotifyLink}album/`);
      const temp = searchString.replace(`${spotifyLink}album/`, "").split('?')[0];
      console.log("temp album", temp);
      return "";
      // spotifyApi.getTrack();
    }
    else if (searchString.startsWith(`${spotifyLink}playlist/`)) {
      console.log(`${spotifyLink}playlist/`);
      const temp = searchString.replace(`${spotifyLink}album/`, "").split('?')[0];
      console.log("temp playlist", temp);
      return "";
      // spotifyApi.getTrack();
    }
  }
}

module.exports = spotifySearch;
