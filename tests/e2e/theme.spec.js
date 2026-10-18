import { test, expect } from '@playwright/test';

test('stored appearance resolves to the theme and survives reload', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('qr-studio:appearance', 'dark'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'dark');
});

test('invalid stored value falls back to system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('qr-studio:appearance', 'neon'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('system mode follows OS changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
