const Routine = require('../models/Routine')


async function addRoutine(req,res){
    try{
        const {
            name,
            description,
            steps,
            alarm,
            background
        }=req.body
        const routine = Routine({name,
            description,
            steps,
            alarm,
            background})
        const routineStored = await routine.save()
        res.status(201).send({routineStored})

    }catch (e){
        res.status(500).send({message: e.message})//todo cambiar por mensaje user frienly
    }
}
async function updateRoutine(req,res){
    try{
        const {
            _id,
        }=req.body
        const routine = await Routine.findOneAndUpdate({_id: _id}, req.body, {upsert: true})
        res.status(200).send({routine})

    }catch (e){
        console.log(e.message)
        res.status(500).send({message: e.message})//todo cambiar por mensaje user frienly
    }
}

async function getRoutines(req,res) {
    //lean - objetos planos de js
    const routines = await Routine.find().lean().exec()
    res.status(200).send({routines})
}

async function deleteRoutine(req,res) {
    const routines = await Routine.deleteOne({_id: req.body.routine._id})
    res.status(204).send({routines})
}
const functions = {
    addRoutine, getRoutines, updateRoutine, deleteRoutine
}
module.exports = functions