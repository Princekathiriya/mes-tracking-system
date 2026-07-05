const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateTenant = require('../middleware/auth');

// Apply the authentication middleware to ALL routes in this file.
// If a request doesn't have a valid JWT, it stops here.
router.use(authenticateTenant);

// --- 1. CREATE A NEW ORDER ---
router.post('/', async (req, res) => {
  const { orderNumber, productName, quantity } = req.body;

  try {
    const newOrder = new Order({
      tenantId: req.user.tenantId, // SECURE: Injected by middleware, not by the user!
      orderNumber,
      productName,
      quantity,
      currentStatus: 'Pending',
      statusHistory: [{
        status: 'Pending',
        updatedBy: req.user.id, // Log who created the order
        notes: 'Order Initialized',
        timestamp: new Date()
      }]
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    // Handle the specific error if the orderNumber already exists for this tenant
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Order number already exists for your company.' });
    }
    res.status(500).json({ error: 'Server error creating order.' });
  }
});


// --- 2. GET ALL ORDERS FOR YOUR COMPANY ---
router.get('/', async (req, res) => {
  try {
    // SECURE: Only fetch orders matching the tenantId in the JWT
    const orders = await Order.find({ tenantId: req.user.tenantId })
                              .sort({ createdAt: -1 }); // Newest first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching orders.' });
  }
});


// --- 3. UPDATE ORDER STATUS & ADD TO AUDIT TRAIL ---
router.patch('/:id/status', async (req, res) => {
  const { newStatus, notes } = req.body;
  
  try {
    // Find the order, ensuring it belongs to this tenant
    const order = await Order.findOne({ 
      _id: req.params.id, 
      tenantId: req.user.tenantId 
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found or access denied.' });
    }

    // Update the main status field
    order.currentStatus = newStatus;

    // Push a new entry into the digital thread (audit trail)
    order.statusHistory.push({
      status: newStatus,
      updatedBy: req.user.id, 
      notes: notes || '',
      timestamp: new Date()
    });

    await order.save();
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating order status.' });
  }
});

module.exports = router;