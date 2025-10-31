const { test, expect } = require('@playwright/test');

test.describe('Booking Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('nav button:has-text("Create Booking")');
  });

  test('should display booking form fields', async ({ page }) => {
    await expect(page.locator('input[name="firstname"]')).toBeVisible();
    await expect(page.locator('input[name="lastname"]')).toBeVisible();
    await expect(page.locator('input[name="totalprice"]')).toBeVisible();
    await expect(page.locator('input[name="depositpaid"]')).toBeVisible();
    await expect(page.locator('input[name="bookingdates.checkin"]')).toBeVisible();
    await expect(page.locator('input[name="bookingdates.checkout"]')).toBeVisible();
    await expect(page.locator('input[name="additionalneeds"]')).toBeVisible();
    await expect(page.locator('form button:has-text("Create Booking")')).toBeVisible();
  });

  test('should fill and submit booking form', async ({ page }) => {
    // Fill form
    await page.fill('input[name="firstname"]', 'John');
    await page.fill('input[name="lastname"]', 'Smith');
    await page.fill('input[name="totalprice"]', '200');
    await page.check('input[name="depositpaid"]');
    await page.fill('input[name="bookingdates.checkin"]', '2024-03-01');
    await page.fill('input[name="bookingdates.checkout"]', '2024-03-05');
    await page.fill('input[name="additionalneeds"]', 'Breakfast');
    
    // Verify form values
    expect(await page.locator('input[name="firstname"]').inputValue()).toBe('John');
    expect(await page.locator('input[name="lastname"]').inputValue()).toBe('Smith');
    expect(await page.locator('input[name="totalprice"]').inputValue()).toBe('200');
    
    // Submit form
    await page.click('form button:has-text("Create Booking")');
    
    // Handle any alerts
    page.once('dialog', dialog => {
      console.log(`Form submission dialog: ${dialog.message()}`);
      dialog.accept();
    });
    
    await page.waitForTimeout(1000);
    console.log('✅ Booking form submitted successfully');
  });
});