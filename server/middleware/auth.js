function mockAuth(req, res, next) {
  const authHeader = req.headers['authorization-mock'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (authHeader === 'forbidden') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
}

module.exports = mockAuth;