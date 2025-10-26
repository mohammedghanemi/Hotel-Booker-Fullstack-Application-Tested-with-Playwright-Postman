const { validateToken } = require('../controllers/authController');

const authenticateToken = (req, res, next) => {
  const token = req.headers.cookie?.replace('token=', '') || 
                req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(403).json({ error: 'Authentication token required' });
  }

  if (!validateToken(token)) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  next();
};

module.exports = {
  authenticateToken
};