const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  condition: [{
    type: String,
    default: null // This could be one of the mental health conditions
  }],
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [optionSchema],

});

module.exports = mongoose.model('Question', questionSchema);