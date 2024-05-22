const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    date: {
        type: mongoose.Schema.Types.Date,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
    },
    watch: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Watch',
            required: true
        },
        imageUrl:{
            type:String,
            required:true
        },
        companyBarcode:{
            type:String,
            required:true
        }
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Purchase', purchaseSchema)
