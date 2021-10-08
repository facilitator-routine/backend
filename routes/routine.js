const express = require('express')

//registrar endpoints de rutinas
const api = express.Router()
//import controller
const {addRoutine,getRoutines, updateRoutine,deleteRoutine} = require('../controllers/routineController')

api.post('/routines', addRoutine)
api.get('/routines', getRoutines)
api.put('/routines/:_id', updateRoutine)
api.delete('/routines/:_id', deleteRoutine)




module.exports = api