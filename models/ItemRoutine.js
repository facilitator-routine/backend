const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    order:{
        type: Number,
        required: true
    },
    duration:{
        type: Number,
        required: false
    },
    alarm:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Item', ItemSchema)