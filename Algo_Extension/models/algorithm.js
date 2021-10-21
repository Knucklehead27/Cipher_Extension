const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;

const algoSchema = new Schema({

    name : {
        type : String
    },
    description : {
        type : String
    },
    code : {
        type : String
    },
    contributedBy : {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: String,
        name: String
    },
    practiceLink : {
        type : String
    },
    upCount : [{
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    downCount : [{
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
        }
    }],
    createdOn : Date
})

const Algo = mongoose.model('algo', algoSchema);

module.exports = Algo;