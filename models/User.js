const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    },
    spotifyCredential: {
        type: mongoose.Schema.Types.ObjectId, ref: 'UserSpotifyCredential',
        required: false
    },
    routines: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Routines'
        }
    ],
    created: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('User', UserSchema)