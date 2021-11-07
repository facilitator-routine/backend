const User = require('../models/User')
const UserSpotifyCredential = require('../models/UserSpotifyCredentials')
async function findOneOrCreateNewUser(body, access_token, refresh_token){
    try{
        const user = await User.findOne({email:body.email})
        if(!user){
            console.log("ingrese a crear usuario con este body " + JSON.stringify(body))
            const credentialsUser = await UserSpotifyCredential( {spotifyClientId:body.id, spotifyToken:access_token, spotifyRefreshToken:refresh_token}).save()
            const nuevoUser = await User({name:body.display_name , email: body.email, spotifyCredential: credentialsUser}).save()
            console.log("nuevoUser " + nuevoUser)
        } else if (!user.spotifyCredential){
            console.log("creo nueva credencial a usuario ya existente " + JSON.stringify(body))

            const credentialsUser = await UserSpotifyCredential( {spotifyClientId:body.id, spotifyToken:access_token, spotifyRefreshToken:refresh_token}).save()
            await user.updateOne({spotifyCredential:credentialsUser})
        }
    }catch (e){
        console.log(e.message)
    }
}

async function logout(body){
    try{
        console.log("Entre al logout")
        const credential = await UserSpotifyCredential.findOneAndDelete({spotifyToken:body.access_token})
        const u =await User.findOneAndUpdate({spotifyCredential:credential },{spotifyCredential:null})

        console.log("Entre al logout + u " + JSON.stringify(u))

    }catch (e){
        console.log(e.message)
    }
}
/*async function refreshTokenUser(user, access_token){
    try{
        //todo update spotify token. Update token
    }catch (e){
        console.log(e.message)
    }
}*/
const functions = {
    findOneOrCreateNewUser, logout
}
module.exports = functions