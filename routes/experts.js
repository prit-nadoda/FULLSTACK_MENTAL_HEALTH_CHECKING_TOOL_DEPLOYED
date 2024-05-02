const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    profileimage: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    expertise: {
        type: String,
        required: true
    },
    conditions: [{
        type: String,
        required: true
    }],
    email: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Experts', expertSchema);