const { get, post } = require('request');
const util = require('util')
const getRequestPromise = util.promisify(get);
const postRequestPromise = util.promisify(post);
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
        state: state,
        show_dialog:true
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
    const response = await getRequestPromise(options)
    return userService.findOneOrCreateNewUser(response.body, access_token, refresh_token);
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
async function callback (req, res) {
    const authOptions = obtainAuthOptions(req,res);
    if(req.query.error){
        return  res.redirect('http://localhost:3000')
    }
    const response = await postRequestPromise(authOptions)
    if (response.statusCode === 200) {
        const accessToken = response.body.access_token;
        const user = await getUser(accessToken, response.body.refresh_token)
        req.session.userId = user._id.toString()
        req.session.accessToken = accessToken
        req.session.save(function(err) {
            if (!err) {
                res.redirect('http://localhost:3000?t=' + accessToken)
            }
        })
    }

}
async function logout (req,res) {
    try{
        await userService.logout(req.body)
        req.session.destroy()
        res.status(200).send()
    }catch (e) {
        res.status(500).send("Algo salio mal al intentar cerrar sesiòn")
    }
}

const functions = {
    login, callback, logout
}
module.exports = functions
