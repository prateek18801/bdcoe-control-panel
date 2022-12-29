const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    upcoming_event: {
        type: String,
        required: true
    },
    event_code: {
        type: String,
        required: true
    },
    form_status : {
        type: Boolean,
        default: false
    },
    modified_by: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Config', configSchema);
