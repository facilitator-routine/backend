const express = require('express')

//registrar endpoints de rutinas
const api = express.Router()
//import controller
const {addRoutine,getRoutines} = require('../controllers/routineController')

api.post('/routines', addRoutine)
api.get('/routines', getRoutines)


module.exports = api