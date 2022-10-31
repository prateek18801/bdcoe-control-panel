const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member', 'user'],
        default: 'user'
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
