const { test, expect } = require('@playwright/test');

test.describe('Performance & Load Tests', () => {
  let authToken;
  let createdBookingIds = [];

  test.beforeAll(async ({ request }) => {
    console.log('🔐 Setting up authentication...');
    
    // Try multiple authentication methods
    const authPayloads = [
      { username: "admin", password: "password123" },
      { username: "admin", password: "password" },
      { username: "admin", password: "admin" }
    ];

    for (const payload of authPayloads) {
      try {
        const authResp = await request.post('http://localhost:3001/auth', {
          data: payload,
          timeout: 10000
        });

        if (authResp.status() === 200) {
          const authData = await authResp.json();
          authToken = authData.token;
          
          if (authToken) {
            console.log(`✅ Successfully authenticated with ${payload.username}/${payload.password}`);
            break;
          }
        }
      } catch (error) {
        console.log(`❌ Authentication failed with ${payload.username}/${payload.password}`);
      }
    }

    if (!authToken) {
      console.log('⚠️ No authentication token obtained. Some tests may fail.');
    } else {
      console.log('🔐 Obtained auth token');
    }
  });

  test.afterAll(async ({ request }) => {
    console.log('🗑️ Cleaning up created bookings...');
    
    // Clean up created bookings
    for (const bookingId of createdBookingIds) {
      try {
        await request.delete(`http://localhost:3001/booking/${bookingId}`, {
          headers: {
            'Cookie': `token=${authToken}`
          }
        });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    console.log(`🗑️ Cleaned up ${createdBookingIds.length} test bookings`);
  });

  test('Booking creation load - 5 simultaneous bookings', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('🚀 Testing 5 simultaneous booking creations...');
    const startTime = Date.now();
    
    const bookingPromises = Array.from({ length: 5 }, (_, i) => 
      request.post('http://localhost:3001/booking', {
        data: {
          firstname: `LoadTest${i}`,
          lastname: `User${i}`,
          totalprice: 100 + i,
          depositpaid: true,
          bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-02'
          },
          additionalneeds: `Performance test ${i}`
        },
        headers: {
          'Cookie': `token=${authToken}`
        }
      })
    );

    const responses = await Promise.all(bookingPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Check results
    const successfulBookings = responses.filter(resp => resp.status() === 200);
    const failedBookings = responses.filter(resp => resp.status() !== 200);

    console.log(`✅ ${successfulBookings.length} successful, ❌ ${failedBookings.length} failed`);
    console.log(`⏱️  Total time: ${duration}ms`);
    console.log(`📊 Average time per booking: ${duration / 5}ms`);

    // Store successful booking IDs for cleanup
    for (const resp of successfulBookings) {
      const data = await resp.json();
      createdBookingIds.push(data.bookingid);
    }

    expect(successfulBookings.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
  });

  test('Booking creation load - 10 simultaneous bookings', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('🚀 Testing 10 simultaneous booking creations...');
    const startTime = Date.now();
    
    const bookingPromises = Array.from({ length: 10 }, (_, i) => 
      request.post('http://localhost:3001/booking', {
        data: {
          firstname: `LoadTest10_${i}`,
          lastname: `User${i}`,
          totalprice: 150 + i,
          depositpaid: i % 2 === 0,
          bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-0' + ((i % 5) + 3) // Vary checkout dates
          }
        },
        headers: {
          'Cookie': `token=${authToken}`
        }
      })
    );

    const responses = await Promise.all(bookingPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successfulBookings = responses.filter(resp => resp.status() === 200);
    const failedBookings = responses.filter(resp => resp.status() !== 200);

    console.log(`✅ ${successfulBookings.length} successful, ❌ ${failedBookings.length} failed`);
    console.log(`⏱️  Total time: ${duration}ms`);
    console.log(`📊 Average time per booking: ${duration / 10}ms`);

    // Store successful booking IDs for cleanup
    for (const resp of successfulBookings) {
      const data = await resp.json();
      createdBookingIds.push(data.bookingid);
    }

    expect(duration).toBeLessThan(15000); // Should complete within 15 seconds
  });

  test('GET all bookings response time', async ({ request }) => {
    console.log('📊 Testing GET all bookings response time...');
    
    const startTime = Date.now();
    const response = await request.get('http://localhost:3001/booking');
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  GET all bookings: ${duration}ms`);
    console.log(`📈 Status: ${response.status()}`);

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000); // Should respond within 2 seconds
  });

  test('GET single booking response time', async ({ request }) => {
    console.log('📊 Testing GET single booking response time...');
    
    // First get a valid booking ID
    const allBookings = await request.get('http://localhost:3001/booking');
    if (allBookings.status() === 200) {
      const bookings = await allBookings.json();
      if (bookings.length > 0) {
        const testBookingId = bookings[0].bookingid;
        
        const startTime = Date.now();
        const response = await request.get(`http://localhost:3001/booking/${testBookingId}`);
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`⏱️  GET single booking: ${duration}ms`);
        console.log(`📈 Status: ${response.status()}`);

        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(1000); // Should respond within 1 second
      } else {
        console.log('⏭️ No bookings available for testing');
      }
    }
  });

  test('Authentication token issuance under load', async ({ request }) => {
    console.log('🔐 Testing authentication under load...');
    
    const authPromises = Array.from({ length: 5 }, () => 
      request.post('http://localhost:3001/auth', {
        data: { username: "admin", password: "password123" }
      })
    );

    const startTime = Date.now();
    const responses = await Promise.all(authPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successfulAuths = responses.filter(resp => resp.status() === 200);
    
    console.log(`✅ ${successfulAuths.length} successful authentications`);
    console.log(`⏱️  Total time: ${duration}ms`);
    console.log(`📊 Average time per auth: ${duration / 5}ms`);

    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });

  test('Update bookings under load', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('🔄 Testing booking updates under load...');
    
    // First get some existing bookings
    const allBookings = await request.get('http://localhost:3001/booking');
    if (allBookings.status() === 200) {
      const bookings = await allBookings.json();
      const testBookings = bookings.slice(0, 3); // Test with first 3 bookings
      
      if (testBookings.length > 0) {
        const updatePromises = testBookings.map(booking =>
          request.put(`http://localhost:3001/booking/${booking.bookingid}`, {
            data: {
              ...booking,
              totalprice: booking.totalprice + 50, // Modify price
              additionalneeds: `Updated ${Date.now()}`
            },
            headers: {
              'Cookie': `token=${authToken}`
            }
          })
        );

        const startTime = Date.now();
        const responses = await Promise.all(updatePromises);
        const endTime = Date.now();
        const duration = endTime - startTime;

        const successfulUpdates = responses.filter(resp => resp.status() === 200);
        
        console.log(`✅ ${successfulUpdates.length} successful updates`);
        console.log(`⏱️  Total time: ${duration}ms`);

        expect(duration).toBeLessThan(5000);
      } else {
        console.log('⏭️ No bookings available for update testing');
      }
    }
  });

  test('Delete bookings under load', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('🗑️ Testing booking deletions under load...');
    
    // First create some test bookings to delete
    const createPromises = Array.from({ length: 3 }, (_, i) =>
      request.post('http://localhost:3001/booking', {
        data: {
          firstname: `DeleteTest${i}`,
          lastname: `User${i}`,
          totalprice: 100,
          depositpaid: true,
          bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-02'
          }
        },
        headers: {
          'Cookie': `token=${authToken}`
        }
      })
    );

    const createdBookings = await Promise.all(createPromises);
    const bookingIds = [];

    for (const resp of createdBookings) {
      if (resp.status() === 200) {
        const data = await resp.json();
        bookingIds.push(data.bookingid);
      }
    }

    if (bookingIds.length > 0) {
      const deletePromises = bookingIds.map(bookingId =>
        request.delete(`http://localhost:3001/booking/${bookingId}`, {
          headers: {
            'Cookie': `token=${authToken}`
          }
        })
      );

      const startTime = Date.now();
      const responses = await Promise.all(deletePromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const successfulDeletes = responses.filter(resp => resp.status() === 201);
      
      console.log(`✅ ${successfulDeletes.length} successful deletions`);
      console.log(`⏱️  Total time: ${duration}ms`);

      expect(duration).toBeLessThan(5000);
    } else {
      console.log('⏭️ No bookings created for deletion testing');
    }
  });

  test('Invalid booking data should fail', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('❌ Testing invalid booking data rejection...');
    
    const invalidBookings = [
      { /* missing required fields */ },
      { firstname: "Test", lastname: "User" /* missing other fields */ },
      { firstname: "Test", lastname: "User", totalprice: "invalid" /* invalid price */ }
    ];

    const startTime = Date.now();
    const responses = await Promise.all(
      invalidBookings.map(booking =>
        request.post('http://localhost:3001/booking', {
          data: booking,
          headers: {
            'Cookie': `token=${authToken}`
          }
        })
      )
    );
    const endTime = Date.now();
    const duration = endTime - startTime;

    const failedBookings = responses.filter(resp => resp.status() !== 200);
    
    console.log(`✅ ${failedBookings.length} properly rejected invalid bookings`);
    console.log(`⏱️  Total time: ${duration}ms`);

    expect(failedBookings.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(3000);
  });

  // Continue with the remaining tests...
  test('Simultaneous GET and POST bookings', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('🔄 Testing simultaneous GET and POST operations...');
    
    const operations = [
      request.get('http://localhost:3001/booking'),
      request.post('http://localhost:3001/booking', {
        data: {
          firstname: "MixedTest",
          lastname: "User",
          totalprice: 200,
          depositpaid: true,
          bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-02'
          }
        },
        headers: {
          'Cookie': `token=${authToken}`
        }
      })
    ];

    const startTime = Date.now();
    const responses = await Promise.all(operations);
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Mixed operations time: ${duration}ms`);
    expect(duration).toBeLessThan(3000);
  });

  test('Create booking with large payload', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('📦 Testing large payload handling...');
    
    const largeAdditionalNeeds = "A".repeat(5000); // 5KB string
    
    const startTime = Date.now();
    const response = await request.post('http://localhost:3001/booking', {
      data: {
        firstname: "LargePayload",
        lastname: "Test",
        totalprice: 300,
        depositpaid: true,
        bookingdates: {
          checkin: '2024-01-01',
          checkout: '2024-01-02'
        },
        additionalneeds: largeAdditionalNeeds
      },
      headers: {
        'Cookie': `token=${authToken}`
      }
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Large payload time: ${duration}ms`);
    console.log(`📈 Status: ${response.status()}`);

    if (response.status() === 200) {
      const data = await response.json();
      createdBookingIds.push(data.bookingid);
    }

    expect(duration).toBeLessThan(3000);
  });

  test('Rapid multiple booking creation', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('⚡ Testing rapid sequential booking creation...');
    
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
      const response = await request.post('http://localhost:3001/booking', {
        data: {
          firstname: `RapidTest${i}`,
          lastname: `User${i}`,
          totalprice: 100 + i,
          depositpaid: true,
          bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-02'
          }
        },
        headers: {
          'Cookie': `token=${authToken}`
        }
      });

      if (response.status() === 200) {
        const data = await response.json();
        createdBookingIds.push(data.bookingid);
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Rapid creation time: ${duration}ms`);
    console.log(`📊 Average time per booking: ${duration / 5}ms`);

    expect(duration).toBeLessThan(10000);
  });

  test('Ping endpoint under load', async ({ request }) => {
    console.log('🏓 Testing ping endpoint under load...');
    
    const pingPromises = Array.from({ length: 10 }, () =>
      request.get('http://localhost:3001/ping')
    );

    const startTime = Date.now();
    const responses = await Promise.all(pingPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successfulPings = responses.filter(resp => resp.status() === 201);
    
    console.log(`✅ ${successfulPings.length} successful pings`);
    console.log(`⏱️  Total time: ${duration}ms`);

    expect(successfulPings.length).toBe(10);
    expect(duration).toBeLessThan(2000);
  });

  test('Booking update with invalid ID', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('❌ Testing update with invalid booking ID...');
    
    const startTime = Date.now();
    const response = await request.put('http://localhost:3001/booking/invalid_id_123', {
      data: {
        firstname: "Test",
        lastname: "User",
        totalprice: 100,
        depositpaid: true
      },
      headers: {
        'Cookie': `token=${authToken}`
      }
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Invalid update time: ${duration}ms`);
    console.log(`📈 Status: ${response.status()}`);

    expect(response.status()).not.toBe(200); // Should not succeed
    expect(duration).toBeLessThan(1000);
  });

  test('Update non-existent booking', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('❌ Testing update of non-existent booking...');
    
    const startTime = Date.now();
    const response = await request.put('http://localhost:3001/booking/999999', {
      data: {
        firstname: "NonExistent",
        lastname: "Booking",
        totalprice: 100,
        depositpaid: true
      },
      headers: {
        'Cookie': `token=${authToken}`
      }
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Non-existent update time: ${duration}ms`);
    console.log(`📈 Status: ${response.status()}`);

    expect(response.status()).not.toBe(200);
    expect(duration).toBeLessThan(1000);
  });

  test('Mixed API operations under load', async ({ request }) => {
    if (!authToken) {
      console.log('⏭️ Skipping test - no auth token');
      return;
    }

    console.log('🔄 Testing mixed API operations under load...');
    
    const operations = [
      request.get('http://localhost:3001/booking'),
      request.post('http://localhost:3001/booking', {
        data: {
          firstname: "MixedLoad",
          lastname: "Test",
          totalprice: 250,
          depositpaid: true,
          bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-02'
          }
        },
        headers: {
          'Cookie': `token=${authToken}`
        }
      }),
      request.get('http://localhost:3001/ping'),
      request.post('http://localhost:3001/auth', {
        data: { username: "admin", password: "password123" }
      })
    ];

    const startTime = Date.now();
    const responses = await Promise.all(operations);
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Mixed operations time: ${duration}ms`);
    
    // Store created booking ID for cleanup
    const createResponse = responses[1];
    if (createResponse.status() === 200) {
      const data = await createResponse.json();
      createdBookingIds.push(data.bookingid);
    }

    expect(duration).toBeLessThan(5000);
  });
});