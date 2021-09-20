const Routine = require('../models/Routine')


async function addRoutine(req,res){
   // res.status(201).send({message:true})
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
const functions = {
    addRoutine
}
module.exports = functions