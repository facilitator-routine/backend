const express = require('express')
//registrar endpoints de rutinas
const api = express.Router()
const {addRoutine,getRoutines, updateRoutine,deleteRoutine, findRoutine} = require('../controllers/routineController')

api.post('/routines', addRoutine)
api.get('/routines', getRoutines)
api.put('/routines/:_id', updateRoutine)
api.delete('/routines/:_id', deleteRoutine)
api.get('/routines/:_id', findRoutine)

module.exports = api