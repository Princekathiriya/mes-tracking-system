const jwt = require('jsonwebtoken');

const authenticateTenant = (req, res, next) => {
  // 1. Grab the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Extract the token string (removing "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token using your secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the decoded payload (id, tenantId, role) to the request object
    // This makes req.user available to all subsequent routes!
    req.user = decoded; 
    
    // Move to the next middleware or controller route
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};


module.exports = authenticateTenant;