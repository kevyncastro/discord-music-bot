/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID ? process.env.SPOTIFY_CLIENT_ID : '',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? process.env.SPOTIFY_CLIENT_SECRET : '',
});

const getSpotifyAccessToken = async () => {
  try{
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);

    setTimeout(getSpotifyAccessToken, data.body['expires_in'] * 1000);
    return data;
  }
  catch(e){
    console.log('Something went wrong when retrieving an access token', e);
    throw e;
  }
}

getSpotifyAccessToken();

module.exports = { spotifyApi, getSpotifyAccessToken };

