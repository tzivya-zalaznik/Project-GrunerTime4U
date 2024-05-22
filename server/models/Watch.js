const mongoose = require('mongoose')

const watchSchema = new mongoose.Schema({
    company: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    companyBarcode: {
        type: String,
        required: true,
    },
    //גרונר
    actualCost: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    disPrice:{
        type: Number,
    },
    otherColors:{
        type:[String],
        default:[],
    },
    size:{
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    barcode: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["נשים","גברים"],
        required: true,
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Watch', watchSchema)
