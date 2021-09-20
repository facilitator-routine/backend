const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoutineSchema = new Schema({
        name: String,
        description:String,
        steps:Number,
        alarm:String, //url al sonido de alarma
        background:String
        //spotify aqui?
        //modelar collection de steps
        //Order:Number
        //Duration:Time
        //sonido??

    },{
        timestamps:true
})

module.exports = mongoose.model('Routines', RoutineSchema)