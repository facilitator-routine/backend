const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoutineSchema = Schema({
        Name: String,
        Description:String,
        Steps:Number,
        Alarm:String, //url al sonido de alarma
        Background:String
        //spotify aqui?
        //modelar collection de steps
        //Order:Number
        //Duration:Time
        //sonido??

    },{
        timestamps:true
})

module.exports = mongoose.model('Routines', RoutineSchema)