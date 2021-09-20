const express = require('express')

//registrar endpoints de rutinas
const api = express.Router()
//import controller
const {addRoutine} = require('../controllers/routineController')

api.post('/routines', addRoutine)

module.exports = api