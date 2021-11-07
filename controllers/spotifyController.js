const request = require('request');
const dotenv = require("dotenv");
const userService = require("../service/userService")

dotenv.config()
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
const spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI

const generateRandomString = function (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

async function login(req,res) {

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
}

async function getUser(access_token, refresh_token) {
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };
    request.get(options, function (error, response, body) {
        userService.findOneOrCreateNewUser(body, access_token, refresh_token)
    });

}
function obtainAuthOptions(req,_res) {
    const code = req.query.code;
    return {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            code: code,
            redirect_uri: spotify_redirect_uri,
            grant_type: 'authorization_code'
        },

        json: true
    };
}
async function callback (req,res) {

    const authOptions = obtainAuthOptions(req,res);

    request.post(authOptions, function(error, response, body) {
        let access_token;
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            getUser(access_token, body.refresh_token)
            res.redirect('http://localhost:3000?access_token=' + access_token)
        }
    });
}

async function refresh(req, res) {
    //TODO probar
    const refresh_token = req.query.refresh_token; //cambiar por refresh token del user
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(spotify_client_id + ':' + spotify_client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            //guardar nuevo token en el user
            res.send({
                'access_token': access_token
            });
        }
    });
}

async function logout (req,res) {
    try{
        await userService.logout(req.body)
        res.status(200).send()
    }catch (e) {
        res.status(500).send("Algo salio mal al intentar cerrar sesiòn")
    }
}

const functions = {
    login, callback, refresh, logout
}
module.exports = functions
