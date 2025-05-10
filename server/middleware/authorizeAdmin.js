// Middleware to check if the user is an admin
function authorizeAdmin(req, res, next) {
  // Check if the user is authenticated and has admin privileges
  if (req.user && req.user.admin) {
    return next();
  }
  // If not, redirect to the login page or send an error response
  return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.'});
}

module.exports = authorizeAdmin;