async function logoutUser (req,res) {
    console.log("llegue a guardar usuario" + req.query)
}

const functions = {
    logoutUser
}
module.exports = functions