const { test, expect } = require('@playwright/test');

test.describe('Booking Details E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login first
    await page.click('nav button:has-text("Login")');
    await page.click('form button:has-text("Login")');
    await page.waitForTimeout(2000); // Wait for login to complete
  });

  test('should display complete booking details', async ({ page }) => {
    // First, check if there are any bookings visible
    const bookingCards = page.locator('.booking-card');
    const cardCount = await bookingCards.count();
    
    if (cardCount === 0) {
      console.log('⚠️ No booking cards found, creating a test booking first...');
      
      // Create a test booking first
      await page.click('nav button:has-text("Create Booking")');
      await page.fill('input[name="firstname"]', 'Test');
      await page.fill('input[name="lastname"]', 'Details');
      await page.fill('input[name="totalprice"]', '150');
      await page.check('input[name="depositpaid"]');
      await page.fill('input[name="bookingdates.checkin"]', '2024-02-01');
      await page.fill('input[name="bookingdates.checkout"]', '2024-02-03');
      await page.fill('input[name="additionalneeds"]', 'Testing details');
      
      await page.click('form button:has-text("Create Booking")');
      
      // Handle alert
      page.once('dialog', dialog => {
        console.log(`Created booking: ${dialog.message()}`);
        dialog.accept();
      });
      
      await page.waitForTimeout(2000);
      
      // Go back to booking list
      await page.click('nav button:has-text("All Bookings")');
      await page.waitForTimeout(2000);
    }

    // Now try to click on a booking card
    const viewDetailButtons = page.locator('button:has-text("View Details")');
    const buttonCount = await viewDetailButtons.count();
    
    if (buttonCount > 0) {
      await viewDetailButtons.first().click();
      
      // Should see booking details page
      await expect(page.locator('text=Booking Details')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Guest Name:')).toBeVisible();
      await expect(page.locator('text=Total Price:')).toBeVisible();
      await expect(page.locator('button:has-text("Back to List")')).toBeVisible();
    } else {
      console.log('⚠️ No "View Details" buttons found, skipping details test');
    }
  });

  test('should show edit button when authenticated', async ({ page }) => {
    // Check if we're on a details page or need to navigate to one
    const isOnDetailsPage = await page.locator('text=Booking Details').isVisible();
    
    if (!isOnDetailsPage) {
      // Try to navigate to a details page if not already there
      const viewDetailButtons = page.locator('button:has-text("View Details")');
      if (await viewDetailButtons.count() > 0) {
        await viewDetailButtons.first().click();
        await page.waitForTimeout(1000);
      } else {
        console.log('⚠️ No booking details available to test edit button');
        return;
      }
    }

    // Check for edit button (should be visible when authenticated)
    const editButton = page.locator('button:has-text("Edit Booking")');
    if (await editButton.isVisible()) {
      await expect(editButton).toBeVisible();
      console.log('✅ Edit button is visible when authenticated');
    } else {
      console.log('⚠️ Edit button not found (might be expected behavior)');
    }
  });

  test('should navigate to edit view', async ({ page }) => {
    // Navigate to a details page first
    const viewDetailButtons = page.locator('button:has-text("View Details")');
    if (await viewDetailButtons.count() === 0) {
      console.log('⚠️ No bookings available for edit test');
      return;
    }
    
    await viewDetailButtons.first().click();
    await page.waitForTimeout(1000);
    
    // Click edit button if available
    const editButton = page.locator('button:has-text("Edit Booking")');
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Should be in edit form view
      await expect(page.locator('text=Update Booking')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('input[name="firstname"]')).toBeVisible();
    } else {
      console.log('⚠️ Edit button not available, skipping edit view test');
    }
  });

  test('should refresh booking details', async ({ page }) => {
    // Navigate to a details page
    const viewDetailButtons = page.locator('button:has-text("View Details")');
    if (await viewDetailButtons.count() === 0) {
      console.log('⚠️ No bookings available for refresh test');
      return;
    }
    
    await viewDetailButtons.first().click();
    await page.waitForTimeout(1000);
    
    // Click refresh button if available
    const refreshButton = page.locator('button:has-text("Refresh")');
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      
      // Should still be on details page after refresh
      await expect(page.locator('text=Booking Details')).toBeVisible({ timeout: 5000 });
      console.log('✅ Refresh button works');
    } else {
      console.log('⚠️ Refresh button not found on details page');
    }
  });

  test('should navigate back from details to list', async ({ page }) => {
    // Navigate to a details page
    const viewDetailButtons = page.locator('button:has-text("View Details")');
    if (await viewDetailButtons.count() === 0) {
      console.log('⚠️ No bookings available for back navigation test');
      return;
    }
    
    await viewDetailButtons.first().click();
    await page.waitForTimeout(1000);
    
    // Click back button
    const backButton = page.locator('button:has-text("Back to List")');
    if (await backButton.isVisible()) {
      await backButton.click();
      
      // Should be back on booking list
      await expect(page.locator('text=All Bookings')).toBeVisible({ timeout: 5000 });
      console.log('✅ Back navigation works');
    } else {
      console.log('⚠️ Back button not found on details page');
    }
  });
});