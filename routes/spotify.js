const {Router} = require("express");
const {login, callback, logout} = require("../controllers/spotifyController")

global.access_token = ''
global.user = ''

const api = Router()

api.get('/auth/login',login)
api.get('/auth/callback', callback)
api.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token})
})
api.delete('/logout',logout)

module.exports = api




