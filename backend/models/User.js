

const mongoose = require('mongoose');

// The User represents an employee. They MUST belong to a Tenant.
const userSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true // CRITICAL: Speeds up finding all users for a specific company
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Operator'],
    default: 'Operator'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);