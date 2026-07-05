const mongoose = require('mongoose');

// The Tenant represents a single company or organization using the MES.
const tenantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  industry: { 
    type: String, 
    trim: true 
  },
  subscriptionStatus: {
    type: String,
    enum: ['Active', 'Suspended', 'Trial'],
    default: 'Active'
  }
}, { 
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

module.exports = mongoose.model('Tenant', tenantSchema);