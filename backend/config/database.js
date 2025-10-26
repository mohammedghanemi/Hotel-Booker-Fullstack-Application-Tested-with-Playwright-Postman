const { MongoClient, ObjectId } = require('mongodb');

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // استخدم الـ environment variable مباشرة
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is required');
      }

      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('hotel-booker');
      this.isConnected = true;
      
      console.log('✅ Connected to MongoDB Atlas');
      
      // Create indexes
      await this.createIndexes();
      
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      await this.db.collection('bookings').createIndex({ bookingid: 1 }, { unique: true });
      await this.db.collection('bookings').createIndex({ firstname: 1 });
      await this.db.collection('bookings').createIndex({ lastname: 1 });
      await this.db.collection('tokens').createIndex({ token: 1 }, { unique: true });
      await this.db.collection('tokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      
      console.log('✅ Database indexes created');
    } catch (error) {
      console.error('Index creation error:', error);
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('✅ MongoDB disconnected');
    }
  }

  getCollection(collectionName) {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    return this.db.collection(collectionName);
  }

  objectId(id) {
    return new ObjectId(id);
  }

  isValidObjectId(id) {
    return ObjectId.isValid(id);
  }
}

// Create singleton instance
const mongoDB = new MongoDB();

module.exports = mongoDB;