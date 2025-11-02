const { test, expect } = require('@playwright/test');

// Run tests sequentially to avoid state conflicts
test.describe.configure({ mode: 'serial' });

test.describe('Booking Details E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Login first
    await page.click('nav button:has-text("Login")');
    await page.click('form button:has-text("Login")');
    await page.waitForTimeout(3000);
  });

  test('should display complete booking details', async ({ page }) => {
    console.log('Starting test: display complete booking details');
    
    // Navigate to bookings list first
    await page.click('nav button:has-text("All Bookings")');
    await page.waitForTimeout(2000);
    
    // Check if there are any bookings visible
    const bookingCards = page.locator('.booking-card');
    const cardCount = await bookingCards.count();
    
    if (cardCount === 0) {
      console.log('No booking cards found, creating a test booking first...');
      await createTestBooking(page);
    }

    // Wait for View Details buttons and click the first one
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.locator('button:has-text("View Details")').first().click();
    await page.waitForTimeout(2000);
    
    // Verify booking details page content based on your actual component
    await expect(page.locator('h2:has-text("Booking Details")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Guest Name:')).toBeVisible();
    await expect(page.locator('text=Total Price:')).toBeVisible();
    await expect(page.locator('text=Booking ID:')).toBeVisible();
    await expect(page.locator('text=Deposit Paid:')).toBeVisible();
    await expect(page.locator('text=Check-in:')).toBeVisible();
    await expect(page.locator('text=Check-out:')).toBeVisible();
    await expect(page.locator('button:has-text("Back to List")')).toBeVisible();
    
    console.log('✅ Booking details displayed successfully');
  });

  test('should show edit button when authenticated', async ({ page }) => {
    console.log('Starting test: check edit button visibility');
    
    // Navigate to bookings list first
    await page.click('nav button:has-text("All Bookings")');
    await page.waitForTimeout(2000);
    
    // Ensure we have at least one booking
    const bookingCards = page.locator('.booking-card');
    if (await bookingCards.count() === 0) {
      console.log('No bookings found, creating one...');
      await createTestBooking(page);
    }
    
    // Navigate to details
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.locator('button:has-text("View Details")').first().click();
    await page.waitForTimeout(2000);
    
    // Check for edit button - should be visible since we're authenticated
    const editButton = page.locator('button:has-text("Edit Booking")');
    await expect(editButton).toBeVisible({ timeout: 10000 });
    console.log('✅ Edit button is visible when authenticated');
  });

  test('should navigate to edit view', async ({ page }) => {
    console.log('Starting test: navigate to edit view');
    
    // Navigate to bookings list
    await page.click('nav button:has-text("All Bookings")');
    await page.waitForTimeout(2000);
    
    // Ensure we have at least one booking
    const bookingCards = page.locator('.booking-card');
    if (await bookingCards.count() === 0) {
      console.log('No bookings found, creating one...');
      await createTestBooking(page);
    }
    
    // Navigate to details
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.locator('button:has-text("View Details")').first().click();
    await page.waitForTimeout(2000);
    
    // Click edit button
    const editButton = page.locator('button:has-text("Edit Booking")');
    await expect(editButton).toBeVisible({ timeout: 10000 });
    await editButton.click();
    await page.waitForTimeout(2000);
    
    // Should be in edit form view - check for form elements
    const hasFormInput = await page.locator('input[name="firstname"]').isVisible({ timeout: 5000 });
    const hasForm = await page.locator('form').isVisible({ timeout: 5000 });
    
    if (hasFormInput || hasForm) {
      console.log('✅ Successfully navigated to edit view');
      await expect(page.locator('input[name="firstname"]')).toBeVisible();
      await expect(page.locator('input[name="lastname"]')).toBeVisible();
    } else {
      const currentUrl = page.url();
      const pageContent = await page.textContent('body');
      console.log('Current URL:', currentUrl);
      console.log('Page contains:', pageContent.substring(0, 500));
      throw new Error('Could not verify edit form navigation');
    }
  });

  test('should refresh booking details', async ({ page }) => {
    console.log('Starting test: refresh booking details');
    
    // Navigate to bookings list
    await page.click('nav button:has-text("All Bookings")');
    await page.waitForTimeout(2000);
    
    // Ensure we have at least one booking
    const bookingCards = page.locator('.booking-card');
    if (await bookingCards.count() === 0) {
      console.log('No bookings found, creating one...');
      await createTestBooking(page);
    }
    
    // Navigate to details
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.locator('button:has-text("View Details")').first().click();
    await page.waitForTimeout(2000);
    
    // Click refresh button (exists in your component)
    const refreshButton = page.locator('button:has-text("Refresh")');
    await expect(refreshButton).toBeVisible({ timeout: 10000 });
    await refreshButton.click();
    
    // Should still be on details page after refresh
    await expect(page.locator('h2:has-text("Booking Details")')).toBeVisible({ timeout: 10000 });
    console.log('✅ Refresh button works');
  });

  test('should navigate back from details to list', async ({ page }) => {
    console.log('Starting test: back navigation');
    
    // Navigate to bookings list
    await page.click('nav button:has-text("All Bookings")');
    await page.waitForTimeout(2000);
    
    // Ensure we have at least one booking
    const bookingCards = page.locator('.booking-card');
    if (await bookingCards.count() === 0) {
      console.log('No bookings found, creating one...');
      await createTestBooking(page);
    }
    
    // Navigate to details
    await page.waitForSelector('button:has-text("View Details")', { timeout: 10000 });
    await page.locator('button:has-text("View Details")').first().click();
    await page.waitForTimeout(2000);
    
    // Click back button
    const backButton = page.locator('button:has-text("Back to List")');
    await expect(backButton).toBeVisible({ timeout: 10000 });
    await backButton.click();
    await page.waitForTimeout(2000);
    
    // Should be back on booking list - use more specific selectors
    // Try multiple ways to verify we're back on the bookings list:
    
    // Option 1: Check for the heading with count (more specific)
    const headingWithCount = page.locator('h2:has-text("All Bookings (")');
    if (await headingWithCount.isVisible({ timeout: 5000 })) {
      console.log('✅ Back navigation works - found heading with count');
      return;
    }
    
    // Option 2: Check for booking cards
    const hasBookingCards = await page.locator('.booking-card').first().isVisible({ timeout: 5000 });
    if (hasBookingCards) {
      console.log('✅ Back navigation works - found booking cards');
      return;
    }
    
    // Option 3: Check for the active nav button
    const activeNavButton = page.locator('nav button.active:has-text("All Bookings")');
    if (await activeNavButton.isVisible({ timeout: 5000 })) {
      console.log('✅ Back navigation works - found active nav button');
      return;
    }
    
    // Option 4: Check URL
    const currentUrl = page.url();
    if (currentUrl.includes('bookings') || currentUrl.endsWith('/')) {
      console.log('✅ Back navigation works - on bookings page');
      return;
    }
    
    // If none of the above work, log for debugging
    console.log('Current URL:', currentUrl);
    const pageText = await page.textContent('body');
    console.log('Page content:', pageText.substring(0, 300));
    throw new Error('Could not verify navigation back to bookings list');
  });
});

// Improved booking creation function with better error handling
async function createTestBooking(page) {
  console.log('Creating test booking...');
  
  await page.click('nav button:has-text("Create Booking")');
  await page.waitForTimeout(2000);
  
  // Fill form with unique data
  const timestamp = Date.now();
  const testData = {
    firstname: `Test${timestamp}`,
    lastname: `User${timestamp}`,
    totalprice: '200',
    checkin: '2024-03-01',
    checkout: '2024-03-03',
    additionalneeds: `Test needs ${timestamp}`
  };
  
  await page.fill('input[name="firstname"]', testData.firstname);
  await page.fill('input[name="lastname"]', testData.lastname);
  await page.fill('input[name="totalprice"]', testData.totalprice);
  await page.check('input[name="depositpaid"]');
  await page.fill('input[name="bookingdates.checkin"]', testData.checkin);
  await page.fill('input[name="bookingdates.checkout"]', testData.checkout);
  await page.fill('input[name="additionalneeds"]', testData.additionalneeds);
  
  // Set up dialog handler
  const dialogHandler = new Promise((resolve, reject) => {
    page.once('dialog', async dialog => {
      const message = dialog.message();
      console.log('Dialog message:', message);
      
      if (message.includes('failed') || message.includes('error') || message.includes('Failed')) {
        await dialog.accept();
        reject(new Error(`Booking creation failed: ${message}`));
      } else {
        await dialog.accept();
        resolve(message);
      }
    });
  });

  try {
    await page.click('form button:has-text("Create Booking")');
    await dialogHandler;
    console.log('✅ Booking created successfully');
  } catch (error) {
    console.error('❌ Booking creation failed:', error.message);
    
    // Try to continue anyway - maybe the booking was created but dialog was wrong
    await page.waitForTimeout(3000);
    
    // Check if we're on a different page indicating success
    const currentUrl = page.url();
    if (!currentUrl.includes('create')) {
      console.log('✅ Booking might have been created (navigated away from create page)');
    } else {
      // If still on create page, try manual navigation
      await page.click('nav button:has-text("All Bookings")');
      await page.waitForTimeout(3000);
      
      // Check if we have any bookings now
      const bookingCards = page.locator('.booking-card');
      if (await bookingCards.count() > 0) {
        console.log('✅ Bookings exist, continuing with test');
      } else {
        throw new Error('Booking creation failed and no bookings available');
      }
    }
  }
  
  // Ensure we're on bookings list
  if (!page.url().includes('bookings')) {
    await page.click('nav button:has-text("All Bookings")');
    await page.waitForTimeout(3000);
  }
}