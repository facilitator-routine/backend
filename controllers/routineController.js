const Routine = require('../models/Routine')
const mongoose = require('mongoose');

const User = require("../models/User")

async function getCurrentUser(req) {
    const userId = req.session.userId
    console.log("Dato de la sesion userId: " + JSON.stringify(req.session))
    return User.findById(userId).exec()
}

async function addRoutine(req,res){

        const {
            name,
            description,
            steps,
            alarm,
            background
        }=req.body
        const currentUser = await getCurrentUser(req);
        const routine = Routine({
            owner: currentUser,
            name,
            description,
            steps,
            alarm,
            background})
        const routineStored = await routine.save()
        res.status(201).send({routineStored})

    }catch (e){
        res.status(500).send({message: e.message})
    }
}
async function updateRoutine(req,res){
    try{
        const {
            _id,
        }=req.body
        // revisar que req.body no pise el owner
        const routine = await Routine.findOneAndUpdate({_id: _id}, req.body, {upsert: true})
        res.status(200).send({routine})

    }catch (e){
        console.log(e.message)
        res.status(500).send({message: e.message})
    }
}

async function getRoutines(req,res) {
    //lean - objetos planos de js
    const currentUser = await getCurrentUser(req);
    const routines = await Routine.find({ owner: currentUser }).lean().exec()
    res.status(200).send({routines})
}

async function deleteRoutine(req,res) {
    if (!mongoose.Types.ObjectId.isValid(req.body.routine._id)) {
        res.status(404).json({ message: "Rutina no encontrada" })
        return;
    }
    const { deletedCount } = await Routine.deleteOne({_id: req.body.routine._id})
    res.setHeader('Content-Type', 'application/json');

    if (deletedCount > 0) {
        res.status(204).json({deletedCount: deletedCount})
    } else {
        res.status(404).json({ message: "Rutina no encontrada" })
    }
}
const functions = {
    addRoutine, getRoutines, updateRoutine, deleteRoutine
}
module.exports = functions