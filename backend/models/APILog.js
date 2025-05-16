const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'API',
    required: true
  },
  name:String,
  endpoint:String,
  status: Number,
  responseTime: Number, // in ms
  method: String,
  success: Boolean,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('APILog', apiLogSchema);
