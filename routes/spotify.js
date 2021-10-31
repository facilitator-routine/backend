const {Router} = require("express");
const {login, callback} = require("../controllers/spotifyController")
const request = require('request');

global.access_token = ''
const api = Router()

api.get('/auth/login',login)
api.get('/auth/callback', callback)
api.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
})
module.exports = api
/*
api.get('/auth/login', (req, res) => {

    const scope = "streaming user-read-email user-read-private"
    const state = generateRandomString(16);

    const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: spotify_redirect_uri,
        state: state
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})



api.get('/auth/callback', (req, res) => {

    console.log("llegue al callback" + req.query)
    const code = req.query.code;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: spotify_redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        let access_token;
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            res.redirect('http://localhost:3000?access_token=' + access_token)
        }
    });

})

api.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
})

*/



