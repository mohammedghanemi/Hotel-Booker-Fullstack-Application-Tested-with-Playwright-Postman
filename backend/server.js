require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoDB = require('./config/database'); // تأكد من هذا السطر

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection middleware - هذا الجزء المهم
app.use(async (req, res, next) => {
  try {
    if (!mongoDB.isConnected) {
      await mongoDB.connect();
    }
    // أضف الـ database مباشرة للـ req object
    req.db = mongoDB;
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/booking', bookingRoutes);
app.use('/ping', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoDB.disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API available at: http://localhost:${PORT}`);
});
