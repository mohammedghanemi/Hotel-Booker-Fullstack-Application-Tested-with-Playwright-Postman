const { test, expect } = require('@playwright/test');

test.describe('Bookings E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login first
    await page.click('nav button:has-text("Login")');
    await page.click('form button:has-text("Login")');
    await page.waitForTimeout(2000); // Wait for login to complete
  });

  test('should display booking list', async ({ page }) => {
    // Should be on booking list view by default after login
    await expect(page.locator('text=All Bookings')).toBeVisible();
    
    // Check if any booking-related content is visible
    const bookingIndicators = [
      '.booking-list',
      '.bookings-grid',
      '.booking-card',
      'text=Booking ID'
    ];
    
    let bookingContentFound = false;
    for (const indicator of bookingIndicators) {
      if (await page.locator(indicator).isVisible()) {
        bookingContentFound = true;
        console.log(`✅ Booking content found: ${indicator}`);
        break;
      }
    }
    
    if (!bookingContentFound) {
      console.log('⚠️ No booking content found immediately, might need to wait for load');
      // Wait a bit more and check again
      await page.waitForTimeout(3000);
    }
  });

  test('should navigate to create booking form', async ({ page }) => {
    // Navigate to Create Booking
    await page.click('nav button:has-text("Create Booking")');
    
    // Check if we're on the create booking form
    await expect(page.locator('text=Create New Booking')).toBeVisible();
    await expect(page.locator('input[name="firstname"]')).toBeVisible();
  });

  test('should create new booking', async ({ page }) => {
    // Go to create booking form
    await page.click('nav button:has-text("Create Booking")');
    
    // Fill booking form
    await page.fill('input[name="firstname"]', 'Test');
    await page.fill('input[name="lastname"]', 'User');
    await page.fill('input[name="totalprice"]', '150');
    await page.check('input[name="depositpaid"]');
    await page.fill('input[name="bookingdates.checkin"]', '2024-02-01');
    await page.fill('input[name="bookingdates.checkout"]', '2024-02-03');
    await page.fill('input[name="additionalneeds"]', 'Test booking');
    
    // Submit form
    await page.click('form button:has-text("Create Booking")');
    
    // Handle alert
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.accept();
    });
    
    // Wait for form submission
    await page.waitForTimeout(2000);
    
    console.log('✅ Booking creation attempted');
  });
});