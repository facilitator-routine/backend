const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//aqui todo lo relacionado con express
// Se invoca la función (de la variable express) y se almacena en la variable app.
const app = express();
const routineRoutes = require('./routes/routine')
app.use(cors({
    origin: '*'
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use ('/v1', routineRoutes)

module.exports = app