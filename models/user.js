var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    referCode: {
        type: String,
        unique: true,
    },
    referedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    totalReferred:{
        type: Number,
        default: 0
    },
    points:{
        type: Number,
        default: 0
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema); 