const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const contactSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    type: {
        type: String     
    },
    messege:{
        type: String
    }
});

// Plugin to simplify passport-local authentication


module.exports  = mongoose.model('Contacts', contactSchema);
