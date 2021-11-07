const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSpotifyCredentialSchema = new Schema({
    spotifyClientId: {
        type: Number,
        required: true
    },
    spotifyToken: {
        type: String,
        required: true
    },
    spotifyRefreshToken: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('UserSpotifyCredential', UserSpotifyCredentialSchema)