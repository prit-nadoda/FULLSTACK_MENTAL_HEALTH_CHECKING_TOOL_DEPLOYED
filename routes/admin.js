const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String     
    }
});

// Plugin to simplify passport-local authentication
adminSchema.plugin(plm);

module.exports  = mongoose.model('Admin', adminSchema);

