const {Router} = require("express");
const {login, callback, refresh} = require("../controllers/spotifyController")

global.access_token = ''
const api = Router()

api.get('/auth/login',login)
api.get('/auth/callback', callback)
api.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
})
api.get('/refresh_token',refresh)
module.exports = api




