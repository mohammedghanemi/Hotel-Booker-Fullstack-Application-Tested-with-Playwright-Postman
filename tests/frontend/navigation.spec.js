import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check page title and header
    await expect(page).toHaveTitle(/Hotel Booker/);
    await expect(page.getByRole('heading', { name: '🏨 Hotel Booker' })).toBeVisible();
    
    // Check navigation buttons
    await expect(page.getByRole('button', { name: 'All Bookings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Booking' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should navigate to create booking page', async ({ page }) => {
    await page.goto('/');
    
    // Click create booking button
    await page.getByRole('button', { name: 'Create Booking' }).click();
    
    // Verify we're on create booking page
    await expect(page.getByRole('heading', { name: 'Create New Booking' })).toBeVisible();
    await expect(page.getByLabel('First Name:')).toBeVisible();
    await expect(page.getByLabel('Last Name:')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify we're on login page
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByLabel('Username:')).toBeVisible();
    await expect(page.getByLabel('Password:')).toBeVisible();
  });

  test('should display API status', async ({ page }) => {
    await page.goto('/');
    
    // Check API status is displayed
    const apiStatus = page.locator('.api-status');
    await expect(apiStatus).toBeVisible();
    
    // API status should be either online or offline
    const statusText = await apiStatus.textContent();
    expect(statusText).toMatch(/API: (🟢 Online|🔴 Offline)/);
  });
});