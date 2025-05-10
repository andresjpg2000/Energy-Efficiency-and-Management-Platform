const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization']; // Get the authorization header

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' }); // No token provided
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the header
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' }); // No token provided
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' }); // Invalid token
  }

}

module.exports = authenticate;