const { v4: uuidv4 } = require('uuid');

const createToken = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'password123') {
      const token = uuidv4();
      const tokenData = {
        token,
        username,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };
      
      // Save token to MongoDB
      await req.db.getCollection('tokens').insertOne(tokenData);
      
      res.json({ token });
    } else {
      res.status(200).json({ reason: 'Bad credentials' });
    }
  } catch (error) {
    console.error('Token creation error:', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
};

const validateToken = async (req, token) => {
  try {
    const tokenDoc = await req.db.getCollection('tokens').findOne({
      token,
      expiresAt: { $gt: new Date() }
    });
    
    return !!tokenDoc;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

module.exports = {
  createToken,
  validateToken
};