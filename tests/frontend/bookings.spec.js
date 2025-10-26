import { test, expect } from '@playwright/test';
import { testBooking, authCredentials } from './fixtures/test-data';

test.describe('Bookings Management Tests', () => {
  test('should display bookings list', async ({ page }) => {
    await page.goto('/');
    
    // Check bookings are loaded
    await expect(page.getByRole('heading', { name: /All Bookings \(\d+\)/ })).toBeVisible();
    
    // Check refresh button
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
    
    // Check booking cards exist
    const bookingCards = page.locator('.booking-card');
    await expect(bookingCards).not.toHaveCount(0);
  });

  test('should create new booking', async ({ page }) => {
    await page.goto('/create');
    
    // Fill booking form
    await page.getByLabel('First Name:').fill(testBooking.firstname);
    await page.getByLabel('Last Name:').fill(testBooking.lastname);
    await page.getByLabel('Total Price:').fill(testBooking.totalprice);
    await page.getByLabel('Deposit Paid').check();
    await page.getByLabel('Check-in Date:').fill(testBooking.checkin);
    await page.getByLabel('Check-out Date:').fill(testBooking.checkout);
    await page.getByLabel('Additional Needs:').fill(testBooking.additionalneeds);
    
    // Submit form
    await page.getByRole('button', { name: 'Create Booking' }).click();
    
    // Check success message
    await expect(page.getByText('Booking created successfully!')).toBeVisible();
  });

  test('should view booking details', async ({ page }) => {
    await page.goto('/');
    
    // Click on first booking's view details button
    const firstViewButton = page.locator('.view-btn').first();
    await firstViewButton.click();
    
    // Check we're on details page
    await expect(page.getByRole('heading', { name: 'Booking Details' })).toBeVisible();
    await expect(page.getByRole('button', { name: '← Back to List' })).toBeVisible();
    
    // Check booking details are displayed
    await expect(page.getByText('Booking ID:')).toBeVisible();
    await expect(page.getByText('Guest Name:')).toBeVisible();
    await expect(page.getByText('Total Price:')).toBeVisible();
  });

  test('should delete booking when authenticated', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.getByLabel('Username:').fill(authCredentials.username);
    await page.getByLabel('Password:').fill(authCredentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Go to bookings list
    await page.goto('/');
    
    // Count bookings before deletion
    const bookingCardsBefore = await page.locator('.booking-card').count();
    
    // Click delete on first booking and confirm
    const firstDeleteButton = page.locator('.delete-btn').first();
    await firstDeleteButton.click();
    
    // Confirm deletion in dialog
    page.once('dialog', dialog => dialog.accept());
    
    // Wait for deletion to complete
    await expect(page.getByText('Booking deleted successfully!')).toBeVisible();
    
    // Check bookings count decreased
    const bookingCardsAfter = await page.locator('.booking-card').count();
    expect(bookingCardsAfter).toBeLessThan(bookingCardsBefore);
  });

  test('should not show delete buttons when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Delete buttons should not be visible when not logged in
    const deleteButtons = page.locator('.delete-btn');
    await expect(deleteButtons).toHaveCount(0);
  });

  test('should refresh bookings list', async ({ page }) => {
    await page.goto('/');
    
    // Get initial bookings count
    const initialBookings = await page.locator('.booking-card').count();
    
    // Click refresh button
    await page.getByRole('button', { name: 'Refresh' }).click();
    
    // Check bookings are still loaded
    await expect(page.locator('.booking-card').first()).toBeVisible();
    
    const refreshedBookings = await page.locator('.booking-card').count();
    expect(refreshedBookings).toBe(initialBookings);
  });
});