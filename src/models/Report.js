const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: {
    type: String,
    enum: ['corruption', 'infrastructure', 'environment', 'public-safety', 'other'],
    required: true
  },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-investigation', 'resolved', 'rejected'],
    default: 'submitted'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  statusUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statusUpdatedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
