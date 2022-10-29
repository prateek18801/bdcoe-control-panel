const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    tag: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    participants: {
        type: Number
    },
    budget: {
        type: Number
    },
    coordinators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }]
}, {timestamps: true});

module.exports = mongoose.model('Event', eventSchema);