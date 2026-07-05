const mongoose = require('mongoose');

// 1. Define the Audit Trail Sub-schema
// This keeps track of every time an order changes status.
const statusHistorySchema = new mongoose.Schema({
  status: { 
    type: String, 
    required: true 
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Records exactly WHO made the change
  },
  notes: { 
    type: String // Optional context
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  _id: false // Disable _id generation here to save DB space and improve speed
});

// 2. Define the Main Order Schema
const orderSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true // Speeds up queries isolating a company's data
  },
  orderNumber: { 
    type: String, 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  currentStatus: {
    type: String,
    enum: ['Pending', 'Cutting', 'Welding', 'QC', 'Completed'],
    default: 'Pending'
  },
  statusHistory: [statusHistorySchema] // Embed the audit trail array here
}, { 
  timestamps: true 
});

// CRITICAL COMPOUND INDEX: 
// Ensures 'orderNumber' is only unique WITHIN a specific tenant.
// Company A and Company B can both use "ORD-100", but Company A cannot use it twice.
orderSchema.index({ tenantId: 1, orderNumber: 1 }, { unique: true });

module.exports = mongoose.model('Order', orderSchema);