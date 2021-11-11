const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routineRoutes = require('./routes/routine')
const spotifyRoutes = require('./routes/session')
const session = require('express-session')

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(cors({
    origin: '*'
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use ('/v1', routineRoutes)
app.use ('/v1', spotifyRoutes)


module.exports = app