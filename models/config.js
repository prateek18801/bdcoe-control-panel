const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    upcoming_event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    registration: {
        type: Boolean,
        default: false
    },
    modified: {
        type: Date
    }
}, {timestamps: true});

module.exports = mongoose.model('Config', configSchema);
