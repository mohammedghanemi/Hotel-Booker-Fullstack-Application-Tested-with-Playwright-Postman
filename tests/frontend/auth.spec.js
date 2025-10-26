import { test, expect } from '@playwright/test';
import { authCredentials, invalidAuthCredentials } from './fixtures/test-data';

test.describe('Authentication Tests', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill login form
    await page.getByLabel('Username:').fill(authCredentials.username);
    await page.getByLabel('Password:').fill(authCredentials.password);
    
    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check for success message and authentication status
    await expect(page.getByText('Login successful!')).toBeVisible();
    await expect(page.getByText('🔓 Authenticated')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill with invalid credentials
    await page.getByLabel('Username:').fill(invalidAuthCredentials.username);
    await page.getByLabel('Password:').fill(invalidAuthCredentials.password);
    
    // Submit form
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check for error message
    await expect(page.getByText('Login failed: Bad credentials')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/auth');
    
    // Login first
    await page.getByLabel('Username:').fill(authCredentials.username);
    await page.getByLabel('Password:').fill(authCredentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for login to complete
    await expect(page.getByText('🔓 Authenticated')).toBeVisible();
    
    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Check logout success
    await expect(page.getByText('Logged out successfully!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should show default credentials info', async ({ page }) => {
    await page.goto('/auth');
    
    // Check default credentials are displayed
    await expect(page.getByText('Default Credentials:')).toBeVisible();
    await expect(page.getByText('Username: admin')).toBeVisible();
    await expect(page.getByText('Password: password123')).toBeVisible();
  });
});