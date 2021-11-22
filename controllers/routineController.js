const Routine = require('../models/Routine')
const mongoose = require('mongoose');
const User = require("../models/User")
const Item = require("../models/ItemRoutine")

async function getCurrentUser(req) {
    const userId = req.session.userId
    return User.findById(userId).exec()
}

async function addRoutine(req,res){
    try{
        const { name, description, items, alarm, background} = req.body
        const currentUser = await getCurrentUser(req);
        const itemObjects = await Promise.all(items.map(item => {
            return Item({ order: item[0], type: item[1], duration: item[2] }).save()
        }))
        const routine = Routine({
            owner: currentUser,
            name,
            description,
            items: itemObjects,
            alarm,
            background})
        const routineStored = await routine.save()
        res.status(201).send({routineStored})
    } catch (e) {
        console.error("Add Routine error: " + e.message)
        if(e.message.includes("validation failed")){
            return res.status(400).send({message:"Error de validación de datos"})
        }
        res.status(500).send({message: e.message})
    }
}
async function updateRoutine(req,res){
    try{
        const { _id, name, description, items, alarm, background } = req.body
        // eliminar items
        const routine = await Routine.findOne({_id: _id})
        const itemIds = routine.items?.map(item => item._id )
        await Item.deleteMany({ _id: { $in: itemIds }})
        //agergar nuevos
        const itemObjects = await Promise.all(items.map(item => {
            return Item({ order: item[0], type: item[1], duration: item[2] }).save()
        }))
        const editedRoutine = await Routine.findOneAndUpdate({_id: _id}, {  ...req.body, items:itemObjects }, { returnDocument: 'after'});
        res.status(200).send({editedRoutine})
    } catch (e) {
        console.log("Update Routine error: " + e.message)
        if(e.message.includes("validation failed")){
            return res.status(400).send({message:"Error de validación de datos"})
        }
        res.status(500).send({message: e.message})
    }
}

async function getRoutines(req,res) {
    //lean - objetos planos de js
    const currentUser = await getCurrentUser(req);
    const routines = await Routine.find({ owner: currentUser }).populate('items').lean().exec()
    res.status(200).send({routines})
}

async function deleteRoutine(req,res) {
    console.log("delete body " + JSON.stringify(req.body.routine))
    if (!mongoose.Types.ObjectId.isValid(req.body.routine._id)) {
        res.status(404).json({ message: "Rutina no encontrada" })
        return;
    }
    const itemIds = req.body.routine.items?.map(item => item._id )
    await Item.deleteMany({ _id: { $in: itemIds }})
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