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
  },
  {
    bookingid: 4,
    firstname: "John",
    lastname: "Davis",
    totalprice: 450,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-01-15",
      checkout: "2024-01-18"
    },
    additionalneeds: "Sea view room",
    createdAt: new Date()
  },
  {
    bookingid: 5,
    firstname: "Emma",
    lastname: "Wilson",
    totalprice: 320,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-02-01",
      checkout: "2024-02-05"
    },
    additionalneeds: "Late checkout",
    createdAt: new Date()
  },
  {
    bookingid: 6,
    firstname: "Michael",
    lastname: "Johnson",
    totalprice: 275,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-01-20",
      checkout: "2024-01-22"
    },
    additionalneeds: "Airport transfer",
    createdAt: new Date()
  },
  {
    bookingid: 7,
    firstname: "Sarah",
    lastname: "Miller",
    totalprice: 520,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-03-10",
      checkout: "2024-03-15"
    },
    additionalneeds: "Spa package",
    createdAt: new Date()
  },
  {
    bookingid: 8,
    firstname: "David",
    lastname: "Taylor",
    totalprice: 180,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-02-14",
      checkout: "2024-02-16"
    },
    additionalneeds: "Romantic package",
    createdAt: new Date()
  },
  {
    bookingid: 9,
    firstname: "Lisa",
    lastname: "Anderson",
    totalprice: 290,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-01-25",
      checkout: "2024-01-27"
    },
    additionalneeds: "Vegetarian meals",
    createdAt: new Date()
  },
  {
    bookingid: 10,
    firstname: "Robert",
    lastname: "Thomas",
    totalprice: 410,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-02-20",
      checkout: "2024-02-25"
    },
    additionalneeds: "Meeting room",
    createdAt: new Date()
  },
  {
    bookingid: 11,
    firstname: "Jennifer",
    lastname: "Jackson",
    totalprice: 150,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-01-30",
      checkout: "2024-02-01"
    },
    additionalneeds: "City view",
    createdAt: new Date()
  },
  {
    bookingid: 12,
    firstname: "William",
    lastname: "White",
    totalprice: 380,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-03-05",
      checkout: "2024-03-08"
    },
    additionalneeds: "Extra bed",
    createdAt: new Date()
  },
  {
    bookingid: 13,
    firstname: "Maria",
    lastname: "Harris",
    totalprice: 220,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-02-08",
      checkout: "2024-02-11"
    },
    additionalneeds: "Translator service",
    createdAt: new Date()
  },
  {
    bookingid: 14,
    firstname: "James",
    lastname: "Martin",
    totalprice: 195,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-01-18",
      checkout: "2024-01-20"
    },
    additionalneeds: "Gym access",
    createdAt: new Date()
  },
  {
    bookingid: 15,
    firstname: "Patricia",
    lastname: "Thompson",
    totalprice: 310,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-03-12",
      checkout: "2024-03-16"
    },
    additionalneeds: "Baby crib",
    createdAt: new Date()
  },
  {
    bookingid: 16,
    firstname: "Christopher",
    lastname: "Garcia",
    totalprice: 175,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-02-28",
      checkout: "2024-03-01"
    },
    additionalneeds: "Early check-in",
    createdAt: new Date()
  },
  {
    bookingid: 17,
    firstname: "Linda",
    lastname: "Martinez",
    totalprice: 480,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-03-18",
      checkout: "2024-03-23"
    },
    additionalneeds: "Pool access",
    createdAt: new Date()
  },
  {
    bookingid: 18,
    firstname: "Richard",
    lastname: "Robinson",
    totalprice: 265,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-02-05",
      checkout: "2024-02-08"
    },
    additionalneeds: "Business class",
    createdAt: new Date()
  },
  {
    bookingid: 19,
    firstname: "Susan",
    lastname: "Clark",
    totalprice: 340,
    depositpaid: true,
    bookingdates: {
      checkin: "2024-01-12",
      checkout: "2024-01-16"
    },
    additionalneeds: "Pet friendly",
    createdAt: new Date()
  },
  {
    bookingid: 20,
    firstname: "Daniel",
    lastname: "Rodriguez",
    totalprice: 290,
    depositpaid: false,
    bookingdates: {
      checkin: "2024-03-25",
      checkout: "2024-03-28"
    },
    additionalneeds: "Free parking",
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
      console.log(`   - ${booking.firstname} ${booking.lastname} (ID: ${booking.bookingid}) - $${booking.totalprice}`);
    });
    
    await mongoDB.disconnect();
    console.log('🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleBookings, seedDatabase };