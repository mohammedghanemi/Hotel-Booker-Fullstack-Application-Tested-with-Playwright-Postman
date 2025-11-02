require('dotenv').config(); 
const mongoDB = require('../config/database');

const sampleBookings = [
  {
    bookingid: 1,
    firstname: "Sally",
    lastname: "Brown",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2023-02-23",
      checkout: "2023-02-25"
    },
    additionalneeds: "Breakfast",
    createdAt: new Date()
  },
  {
    bookingid: 2,
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 222,
    depositpaid: false,
    bookingdates: {
      checkin: "2023-03-01",
      checkout: "2023-03-05"
    },
    additionalneeds: "Lunch",
    createdAt: new Date()
  },
  {
    bookingid: 3,
    firstname: "Alice",
    lastname: "Smith",
    totalprice: 333,
    depositpaid: true,
    bookingdates: {
      checkin: "2023-04-10",
      checkout: "2023-04-15"
    },
    additionalneeds: "Dinner",
    createdAt: new Date()
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    await mongoDB.connect();
    
    // Clear existing data
    await mongoDB.getCollection('bookings').deleteMany({});
    await mongoDB.getCollection('tokens').deleteMany({});
    
    // Insert sample bookings
    const result = await mongoDB.getCollection('bookings').insertMany(sampleBookings);
    
    console.log(`✅ Inserted ${result.insertedCount} sample bookings`);
    console.log('📊 Sample bookings:');
    sampleBookings.forEach(booking => {
      console.log(`   - ${booking.firstname} ${booking.lastname} (ID: ${booking.bookingid})`);
    });
    
    await mongoDB.disconnect();
    console.log('🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();