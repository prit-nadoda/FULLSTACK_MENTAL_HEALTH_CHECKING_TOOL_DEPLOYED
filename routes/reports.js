const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    conditions: [
      {
        condition: {
          type: String,
          default: ["You Have a Balanced Mental Status"]
        },  
        signs: {
          type: [String],
          default : ["No Significant Signs"],
        },
        icon:{
          type: String,
          default: "/images/none.png"
        }
      },
    ],
    date: {
      type: Date,
      default: Date.now,
      get: function(date) {
        const options = {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      }
    }
    
  });
  
module.exports = mongoose.model('Report', reportSchema);

