// las librerias
require('dotenv').config();
const app = require('./app');
const { appConfig, dbConfig} = require('./config');
const { connectDb } = require('./db/mongodb');


async function initApp(appConfig,dbConfig){
  try{
    //conectar la base
    await connectDb(dbConfig)
    //corre el server
    app.listen(appConfig.port, ()=>console.log("hola Rochi"))
  }catch (e){
    console.error(e)
    process.exit(0) //mata el proceso de node

  }

}
initApp(appConfig, dbConfig)


// Define el home de la página y que función se va a ejecutar.
// La función tiene como parámetro el request y el response.
app.get('/', function (req, res) {
  res.send('Este es el home')
  console.log("Página de inicio...")
})



