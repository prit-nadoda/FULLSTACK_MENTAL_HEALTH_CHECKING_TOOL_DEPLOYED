const mongoose = require('mongoose');

const optionSchema = mongoose.Schema({
    text : {
        type: String,
        required : true
    },
    condition : [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model("Options",optionSchema);