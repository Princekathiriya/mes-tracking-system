const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Note: Make sure you installed bcryptjs, not bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// --- REGISTER A NEW TENANT & ADMIN USER ---
router.post('/register', async (req, res) => {
  const { companyName, userName, email, password } = req.body;

  try {
    // 1. Check if user already exists
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    // 2. Create the new Tenant (Company)
    const newTenant = new Tenant({ name: companyName });
    await newTenant.save();

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the Admin User tied to the new Tenant
    const newUser = new User({
      tenantId: newTenant._id,
      name: userName,
      email,
      passwordHash: hashedPassword,
      role: 'Admin'
    });
    await newUser.save();

    res.status(201).json({ message: 'Tenant and Admin user created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// --- USER LOGIN & JWT ISSUANCE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    // 3. Construct JWT Payload (Including the crucial tenantId)
    const payload = {
      id: user._id,
      tenantId: user.tenantId,
      role: user.role
    };

    // 4. Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, role: user.role, tenantId: user.tenantId }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;