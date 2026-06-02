const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  accepted: {
    type: Boolean,
    required: true
  },
  respondentName: {
    type: String,
    default: 'Anonyme'
  },
  dateChosen: {
    type: String,
    default: null
  },
  timeChosen: {
    type: String,
    default: null
  },
  foodChosen: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', ResponseSchema);