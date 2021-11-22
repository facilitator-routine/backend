const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    order:{
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Cronómetro', 'Cuenta Regresiva'],
    },
    duration:{
        type: String,
        required: false
    },
    alarm:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Item', ItemSchema)