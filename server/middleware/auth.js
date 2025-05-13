const jwt = require('jsonwebtoken');

function authenticate(adminOnly = false) {
  return function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' }); // No token provided
    }

    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach the decoded user information to the request object

      if (adminOnly && !decoded.admin) {
        return res.status(403).json({ message: 'Forbidden, only admins can access this route.' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' }); // Invalid token
    }

  }
}

module.exports = authenticate;