const db = require("../models/index.js");
const User = db.User;
// Middleware to check if the user is an admin
async function authorizeAdmin(req, res, next) {
  // Check if the user is authenticated and has admin privileges
  try {
    const user = await User.findByPk(req.user.id_user, {
      attributes: ['id_user', 'admin']
    });
    if (!user || !user.admin) {
      // If the user is not found or is not an admin, return a 403 Forbidden response
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access this resource.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
module.exports = authorizeAdmin;