// models/Plan.js
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  includedCalls: { type: Number, required: true },
  
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
