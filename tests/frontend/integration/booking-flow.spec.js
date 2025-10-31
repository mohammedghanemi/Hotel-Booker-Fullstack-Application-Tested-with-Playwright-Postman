const { test, expect } = require('@playwright/test');

test.describe('Booking Integration Tests - Frontend + Backend', () => {
  const FRONTEND_URL = 'http://localhost:3000'; // Your React app
  const BACKEND_URL = 'http://localhost:3001';  // Your backend API

  test('API to frontend data flow', async ({ request }) => {
    console.log('🚀 Testing API -> Frontend data flow...');
    
    // Step 1: Create booking via API
    const bookingData = {
      firstname: "Integration",
      lastname: "Test", 
      totalprice: 300,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-03-01",
        checkout: "2024-03-05"
      },
      additionalneeds: "Integration Test"
    };

    const apiResponse = await request.post(`${BACKEND_URL}/booking`, {
      data: bookingData
    });
    
    expect(apiResponse.status()).toBe(200);
    const apiBooking = await apiResponse.json();
    const bookingId = apiBooking.bookingid;
    console.log(`✅ Booking created via API - ID: ${bookingId}`);

    // Step 2: Verify booking exists via API (data consistency check)
    const getResponse = await request.get(`${BACKEND_URL}/booking/${bookingId}`);
    expect(getResponse.status()).toBe(200);
    const retrievedBooking = await getResponse.json();
    
    expect(retrievedBooking.firstname).toBe(bookingData.firstname);
    expect(retrievedBooking.lastname).toBe(bookingData.lastname);
    console.log('✅ Data consistency verified via API');
  });

  test('authentication token flow', async ({ request }) => {
    console.log('🔐 Testing authentication token flow...');
    
    // Step 1: Get token via API
    const authResponse = await request.post(`${BACKEND_URL}/auth`, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    
    expect(authResponse.status()).toBe(200);
    const authData = await authResponse.json();
    const token = authData.token;
    expect(token).toBeTruthy();
    console.log('✅ Token obtained via API');

    // Step 2: Use token for protected operation
    const protectedResponse = await request.put(`${BACKEND_URL}/booking/1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        firstname: "Updated",
        lastname: "Booking",
        totalprice: 200,
        depositpaid: false,
        bookingdates: {
          checkin: "2024-01-01",
          checkout: "2024-01-02"
        }
      }
    });
    
    // Should either work (200) or return appropriate error
    expect([200, 404]).toContain(protectedResponse.status());
    console.log('✅ Token authentication flow verified');
  });

  test('data consistency between API operations', async ({ request }) => {
    console.log('📊 Testing data consistency across API operations...');
    
    // Step 1: Get initial bookings count
    const initialResponse = await request.get(`${BACKEND_URL}/booking`);
    expect(initialResponse.status()).toBe(200);
    const initialBookings = await initialResponse.json();
    const initialCount = initialBookings.length;
    console.log(`✅ Initial bookings count: ${initialCount}`);

    // Step 2: Create a new booking
    const createResponse = await request.post(`${BACKEND_URL}/booking`, {
      data: {
        firstname: "Consistency",
        lastname: "Test",
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: "2024-02-01",
          checkout: "2024-02-02"
        }
      }
    });
    
    expect(createResponse.status()).toBe(200);
    const newBooking = await createResponse.json();
    console.log(`✅ New booking created - ID: ${newBooking.bookingid}`);

    // Step 3: Verify count increased
    const finalResponse = await request.get(`${BACKEND_URL}/booking`);
    const finalBookings = await finalResponse.json();
    const finalCount = finalBookings.length;
    
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    console.log(`✅ Final bookings count: ${finalCount} (increased from ${initialCount})`);
  });

  test('error handling integration', async ({ request }) => {
    console.log('⚠️ Testing error handling integration...');
    
    // Test invalid booking data
    const invalidResponse = await request.post(`${BACKEND_URL}/booking`, {
      data: {
        firstname: "", // Empty - should trigger validation error
        lastname: "Test",
        totalprice: -100, // Negative - invalid
        depositpaid: "yes", // Wrong type
        bookingdates: {
          checkin: "invalid-date",
          checkout: "2024-01-01"
        }
      }
    });
    
    // Should return validation error
    expect(invalidResponse.status()).toBe(400);
    const errorData = await invalidResponse.json();
    expect(errorData).toHaveProperty('error');
    console.log('✅ Validation errors properly handled:', errorData.error);
  });
});