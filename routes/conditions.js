const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  condition: {
    type: String,
    required: true
  },
  icon: [{
    type: String,
    required: true
  }],
  info:{
    type: String
  },
  tips:[{
    type: String
  }]
});


module.exports = mongoose.model('Conditions', conditionSchema);