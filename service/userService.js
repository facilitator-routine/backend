const User = require('../models/User')
const UserSpotifyCredential = require('../models/UserSpotifyCredentials')
async function findOneOrCreateNewUser(body, access_token, refresh_token){
    try{
        let user = await User.findOne({email:body.email}).populate('spotifyCredential')
        if(!user){
            const credentialsUser = await UserSpotifyCredential( {spotifyClientId:body.id, spotifyToken:access_token, spotifyRefreshToken:refresh_token}).save()
            user = await User({name:body.display_name , email: body.email, spotifyCredential: credentialsUser}).save()
        } else if (!user.spotifyCredential){
            const credentialsUser = await UserSpotifyCredential( {spotifyClientId:body.id, spotifyToken:access_token, spotifyRefreshToken:refresh_token}).save()
            user = await User.findOneAndUpdate({email:body.email},{spotifyCredential:credentialsUser}, { returnDocument: 'after'}).populate('spotifyCredential')
        }
        return user
    }catch (e){
        console.log(e.message)
    }
}

async function logout(body){
    try{
        const credential = await UserSpotifyCredential.findOneAndDelete({spotifyToken:body.access_token})
        const u =await User.findOneAndUpdate({spotifyCredential:credential },{spotifyCredential:null})
    }catch (e){
        console.log(e.message)
    }
}

const functions = {
    findOneOrCreateNewUser, logout
}
module.exports = functions