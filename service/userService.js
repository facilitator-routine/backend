const User = require('../models/User')

async function findOneOrCreateNewUser(body, access_token, refresh_token){
    try{
        const user = await User.findOne({email:body.email})
        console.log("useeeeeeeeeeeeeeeeeer value " + user)

        if(!user){
            console.log("ingrese a crear usuario con este body " + JSON.stringify(body))
            const nuevoUser = await User({name:body.display_name , email: body.email, spotifyClientId:body.id, spotifyToken:access_token, spotifyRefreshToken:refresh_token}).save()
            console.log("nuevoUser " + nuevoUser)

        }
    }catch (e){
        console.log(e.message)
    }
}


async function refreshTokenUser(user, access_token){
    try{

        //todo update spotify token. Update token
    }catch (e){
        console.log(e.message)
    }
}
const functions = {
    findOneOrCreateNewUser
}
module.exports = functions