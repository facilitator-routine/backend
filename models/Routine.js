const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoutineSchema = new Schema({
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true
        },
        description:{
            type: String,
            required: false
        },
        alarm:{
            type: String,
            required: false
        },
        background: {
                type: String,
                validate: {
                    validator: function(value) {
                        if (!value)
                            return true;
                        const urlPattern = /(http|https):\/\/(w+:?w*#)?(S+)(:[0-9]+)?/|/([w#!:.?+=&%!-/])?/;
                        const urlRegExp = new RegExp(urlPattern);
                        return value.match(urlRegExp);
                    },
                    message: props => `${props.value} is not a valid URL`
                },
                required: false
        },
        items: [
            {
             type: mongoose.Schema.Types.ObjectId, ref: 'Item'
            }

        ]},
    {
        timestamps:true
})

module.exports = mongoose.model('Routines', RoutineSchema)