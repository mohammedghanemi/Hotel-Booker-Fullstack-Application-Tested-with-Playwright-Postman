const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  // Add global use configuration
  use: {
    baseURL: 'http://localhost:3000',
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.js',
      use: { 
        baseURL: 'http://localhost:3001'
      },
    },
    {
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000'
      },
    },
  ],

  webServer: [
    {
      command: 'npm start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      cwd: '../frontend',
    },
    {
      command: 'npm start',
      url: 'http://localhost:3001/ping',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      cwd: '../backend',
    },
  ],
});