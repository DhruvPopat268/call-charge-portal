const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'API',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  database: {   // ✅ added
    type: String,
  },
  name: String,
  endpoint: String,
  status: Number,
  responseTime: Number, // in ms
  method: String,
  success: Boolean,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// ✅ Helpful compound index so queries by user+database are faster
apiLogSchema.index({ userId: 1, database: 1, timestamp: -1 });

module.exports = mongoose.model('APILog', apiLogSchema);
