/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const { spotifyApi } = require('../integrations/spotify');

const spotifySearch = async (searchString) => {
  const spotifyLink = 'https://open.spotify.com/';
  if (searchString.startsWith(spotifyLink)) {
    if (searchString.startsWith(`${spotifyLink}track/`)) {
      const trackId = getId(searchString)
      try {
        const data = await spotifyApi.getTrack(trackId);
        let searchStringForYt = `${data.body.name} ${data.body.artists[0].name}`;
        return searchStringForYt;
      }
      catch (e) {
        console.log("spotify get track error", e);
        throw e;
      }
    }
    else if (searchString.startsWith(`${spotifyLink}album/`)) {
      const albumId = getId(searchString)
      console.log("temp album", albumId);
      try {
        const data = await spotifyApi.getAlbum(albumId)
        let items = data.body.tracks.items;
        console.log(data.body)
        let searchStrings = items.map((val) => `${val.name} ${val.artists[0].name}`);
        return searchStrings;
      }
      catch (e) {
        console.log("error occured fetching playlist", e)
      }
    }
    else if (searchString.startsWith(`${spotifyLink}playlist/`)) {
      const playlistId = getId(searchString)
      try {
        const data = await spotifyApi.getPlaylist(playlistId);
        let items = data.body.tracks.items;
        let searchStrings = items.map((val) => `${val.track.name} ${val.track.artists[0].name}`);
        return searchStrings;
      }
      catch (e) {
        console.log("error occured fetching playlist", e)
      }
    }
  }
}

const getId = (spotifyUrl) => {
  return spotifyUrl.split('/')[4].split('?')[0];
} 

module.exports = spotifySearch;
