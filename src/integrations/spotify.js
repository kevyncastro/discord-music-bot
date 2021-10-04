/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID ? process.env.SPOTIFY_CLIENT_ID : '',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? process.env.SPOTIFY_CLIENT_SECRET : '',
});

spotifyApi.clientCredentialsGrant().then((data) => {
  console.log(data)
  console.log('The access token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(e => {
  console.log('Something went wrong when retrieving an access token', e)
})

module.exports = spotifyApi;
