const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    stdno: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        enum: ['CSE', 'CS', 'CSE(DS)', 'CSE(AIML)', 'AIML', 'IT', 'CSIT', 'ECE', 'EN', 'ME', 'CIVIL', 'OTHER'],
        required: true
    },
    section: {
        type: Number,
        required: true
    },
    graduation: {
        type: Number,
        required: true
    },
    domain: {
        type: String,
        enum: ['FS', 'BE', 'FE', 'AD', 'ML', 'CP', 'DE'],
        required: true
    },
    coordinator: {
        type: Boolean,
        required: true
    },
    linkedin: {
        type: String,
        unique: true,
        sparse: true
    },
    github: {
        type: String,
        unique: true,
        sparse: true
    },
    imageUrl: {
        type: String,
        unique: true,
        sparse: true
    },
    website: {
        type: String,
        unique: true,
        sparse: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Member', memberSchema);