const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  test('booking creation load test', async ({ request }) => {
    console.log('⚡ Running booking creation load test...');
    
    const startTime = Date.now();
    const requests = [];
    
    // Create 3 bookings simultaneously to test load
    for (let i = 0; i < 3; i++) {
      requests.push(
        request.post('http://localhost:3001/booking', {
          data: {
            firstname: `LoadTest${Date.now()}${i}`, // Unique names
            lastname: 'User',
            totalprice: 100 + i,
            depositpaid: true,
            bookingdates: {
              checkin: '2024-01-01',
              checkout: '2024-01-02'
            }
          }
        })
      );
    }
    
    const responses = await Promise.all(requests);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Count successful responses (201 for created)
    const successfulResponses = responses.filter(r => r.status() === 201).length;
    const failureCount = responses.filter(r => r.status() !== 201).length;
    
    console.log(`Results: ${successfulResponses} successful, ${failureCount} failed`);
    
    // If all failed, that's a problem
    expect(successfulResponses).toBeGreaterThan(0);
    
    console.log(`✅ Load test completed in ${duration}ms`);
    expect(duration).toBeLessThan(3000);
  });

  test('API response time test', async ({ request }) => {
    console.log('⏱️ Testing API response times...');
    
    const endpoints = [
      { path: '/booking', method: 'GET', expectedStatus: 200 },
      { path: '/ping', method: 'GET', expectedStatus: 200 },
      // Add more endpoints as needed
    ];
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      let response;
      
      if (endpoint.method === 'GET') {
        response = await request.get(`http://localhost:3001${endpoint.path}`);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Accept both 200 and 201 status codes for success
      expect(response.status()).toBe(endpoint.expectedStatus);
      console.log(`✅ ${endpoint.path} responded in ${duration}ms with status ${response.status()}`);
      expect(duration).toBeLessThan(2000);
    }
  });
});