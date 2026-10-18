import { defineConfig, devices } from '@playwright/test';

// Set PW_CHROMIUM_PATH to use an already-installed Chromium instead of the
// one downloaded by `npx playwright install chromium`.
const port = process.env.PW_PORT || 3000;
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    env: { BROWSER: 'none' },
  },
});
