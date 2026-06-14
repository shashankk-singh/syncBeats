const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    code: {type: String, required: true, unique: true},
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

} , { timestamps: true })

const Room = mongoose.model('Room', roomSchema)
module.exports = Room