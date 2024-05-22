const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum:['User','Admin'],
        default:"User",
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    watches:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Watch',
        default:[],
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)
