// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for end-to-end testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /**
   * Maximum time one test can run for
   */
  timeout: 30000,
  
  /**
   * Run tests in files in parallel
   */
  fullyParallel: true,
  
  /**
   * Fail the build on CI if you accidentally left test.only in the source code
   */
  forbidOnly: !!process.env.CI,
  
  /**
   * Retry on CI only
   */
  retries: process.env.CI ? 2 : 0,
  
  /**
   * Opt out of parallel tests on CI for stability
   * Use 4 workers on CI, 1 locally for deterministic results
   */
  workers: process.env.CI ? 4 : 1,
  
  /**
   * Reporter to use
   */
  reporter: 'html',
  
  /**
   * Shared settings for all the projects below
   */
  use: {
    /**
     * Base URL to use in actions like `await page.goto('/')`
     */
    baseURL: 'http://localhost:8080',
    
    /**
     * Collect trace when retrying the failed test
     */
    trace: 'on-first-retry',
    
    /**
     * Capture screenshot only on failure
     */
    screenshot: 'only-on-failure',
    
    /**
     * Maximum time each action can take
     */
    actionTimeout: 10000,
    
    /**
     * Maximum time for navigation
     */
    navigationTimeout: 15000,
  },

  /**
   * Configure projects for major browsers
   */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  /**
   * Run your local dev server before starting the tests
   */
  webServer: {
    command: 'docker-compose up',
    port: 8080,
    timeout: 120000,
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});