const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

try {
    
    const json = JSON.parse(fs.readFileSync(path.join(require.main.filename, '..', 'data', 'schema.json')));
    const registrationSchema = mongoose.Schema(json.schema, { timestamps: true });
    module.exports = mongoose.model('Registration', registrationSchema, json.event);

} catch(err) {
    console.error('error creating registration schema ' + err.message);
}

