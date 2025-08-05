const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  stage: {
    type: String,
    required: true,
    enum: ['Design', 'In Progress', 'Validation', 'R&D Prototype', 'Completed', 'On Hold']
  },
  resourceAllocated: {
    type: Number,
    required: true,
    min: 0
  },
  ppaTarget: {
    performance: {
      type: String,
      required: true
    },
    power: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    }
  },
  eligibleRD: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  actualSpend: {
    type: Number,
    required: true,
    min: 0
  },
  forecastSpend: {
    type: Number,
    required: true,
    min: 0
  },
  taxCreditEligible: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

projectSchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

projectSchema.virtual('completionPercentage').get(function() {
  const total = this.endDate - this.startDate;
  const elapsed = Date.now() - this.startDate;
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema); 