const { test, expect } = require('@playwright/test');

test.describe('Auth API Tests - POST /auth', () => {
  const BASE_URL = 'http://localhost:3001';
  const AUTH_ENDPOINT = `${BASE_URL}/auth`;

  test('POST /auth - should create token with valid credentials', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    
    console.log('=== SUCCESSFUL LOGIN TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    // Assertions
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(10);
  });

  test('POST /auth - should fail with wrong username', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'wronguser',
        password: 'password123'
      }
    });
    
    console.log('=== WRONG USERNAME TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    // Your API returns 200 with error in body
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
    expect(body).not.toHaveProperty('token');
  });

  test('POST /auth - should fail with wrong password', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: 'wrongpassword'
      }
    });
    
    console.log('=== WRONG PASSWORD TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
    expect(body).not.toHaveProperty('token');
  });

  test('POST /auth - should fail with empty username', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: '',
        password: 'password123'
      }
    });
    
    console.log('=== EMPTY USERNAME TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth - should fail with empty password', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: ''
      }
    });
    
    console.log('=== EMPTY PASSWORD TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth - should fail with missing username field', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        password: 'password123'
      }
    });
    
    console.log('=== MISSING USERNAME FIELD TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth - should fail with missing password field', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin'
      }
    });
    
    console.log('=== MISSING PASSWORD FIELD TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth - should fail with empty request body', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {}
    });
    
    console.log('=== EMPTY BODY TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth - should work with extra fields in request', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: 'password123',
        extraField: 'shouldNotBreak',
        anotherField: 123
      }
    });
    
    console.log('=== EXTRA FIELDS TEST ===');
    console.log('Response Status:', response.status());
    
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);
    
    expect(response.status()).toBe(200);
    
    const body = JSON.parse(responseBody);
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    // Extra fields should be ignored, not returned
    expect(body).not.toHaveProperty('extraField');
    expect(body).not.toHaveProperty('anotherField');
  });

  test('POST /auth - should have correct content-type header', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    
    const contentType = response.headers()['content-type'];
    console.log('=== CONTENT-TYPE TEST ===');
    console.log('Content-Type Header:', contentType);
    
    expect(response.status()).toBe(200);
    expect(contentType).toContain('application/json');
  });

  test('POST /auth - should return token in reasonable time (< 2 seconds)', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('=== PERFORMANCE TEST ===');
    console.log('Response Time:', duration + 'ms');
    
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);
    
    const body = await response.json();
    expect(body.token).toBeDefined();
  });

  // NEW TEST: Verify token structure (if it's a UUID)
  test('POST /auth - token should be valid UUID format', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    
    console.log('=== TOKEN FORMAT TEST ===');
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  // NEW TEST: Consistent response structure
  test('POST /auth - response should have consistent structure', async ({ request }) => {
    const response = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });
    
    console.log('=== RESPONSE STRUCTURE TEST ===');
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    // Success case should have token, no reason
    expect(body).toHaveProperty('token');
    expect(body).not.toHaveProperty('reason');
    
    // Now test error case structure
    const errorResponse = await request.post(AUTH_ENDPOINT, {
      data: {
        username: 'wrong',
        password: 'wrong'
      }
    });
    
    const errorBody = await errorResponse.json();
    // Error case should have reason, no token
    expect(errorBody).toHaveProperty('reason');
    expect(errorBody).not.toHaveProperty('token');
  });
});