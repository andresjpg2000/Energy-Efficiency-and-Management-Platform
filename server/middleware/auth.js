const jwt = require('jsonwebtoken');
function authenticate(req, res, next) {
  // const token = req.cookies.token;
  const header = req.headers['x-access-token'] || req.headers['authorization'] || req.headers.authorization;
  if (typeof header === 'undefined') {
    return res.status(401).json({ success: false, message: 'Unauthorized, no token provided!' });
  }
  const bearer = header.split(' ');
  const token = bearer[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized, no token provided' });
  }
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information (only id_user) to the request object
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized, invalid or expired token' }); // Invalid token
  }
}
module.exports = authenticate;