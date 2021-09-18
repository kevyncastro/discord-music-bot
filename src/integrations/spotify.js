/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID ? process.env.SPOTIFY_CLIENT_ID : '',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? process.env.SPOTIFY_CLIENT_SECRET : '',
});

spotifyApi.setAccessToken(process.env.SPOTIFY_OAUTH_TOKEN ? process.env.SPOTIFY_OAUTH_TOKEN : '');

module.exports = spotifyApi;
