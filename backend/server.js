const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// Enable CORS for frontend communication
app.use(cors()); 
// Allow Express to parse incoming JSON data in the request body
app.use(express.json()); 

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders')); 

// Basic health check route
app.get('/', (req, res) => {
  res.send('MES Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});