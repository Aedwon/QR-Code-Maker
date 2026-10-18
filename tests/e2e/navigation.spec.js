import { test, expect } from '@playwright/test';
import { openApp } from './helpers/app.js';
import { getPreviewSignature } from './helpers/preview.js';

test('desktop shows all three zones and defaults to Style', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('#app-nav')).toBeVisible();
  await expect(page.locator('#workspace')).toBeVisible();
  await expect(page.locator('#app-inspector')).toBeVisible();
  await expect(page.locator('[data-feature="style"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-feature]')).toHaveCount(5);
});

test('selecting a feature changes the Inspector only', async ({ page }) => {
  await openApp(page);
  await page.locator('#qr-data').fill('https://example.org/nav');
  await page.waitForTimeout(250);
  const before = await getPreviewSignature(page);

  await page.locator('[data-feature="colors"]').click();
  await expect(page.locator('[data-feature="colors"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-feature="style"]')).not.toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-inspector-section="colors"]')).toBeVisible();
  await expect(page.locator('[data-inspector-section="style"]')).toBeHidden();
  await expect(page.locator('[data-inspector-section="style"]')).toHaveJSProperty('inert', true);
  await expect(page.locator('#inspector-title')).toHaveText('Colors');
  await expect(page.locator('#qr-data')).toHaveValue('https://example.org/nav');
  expect(await getPreviewSignature(page)).toBe(before);
});

test('appearance controls apply in place, persist and leave QR styling alone', async ({ page }) => {
  await openApp(page);
  await page.locator('[data-feature="colors"]').click();
  await page.locator('#dot-color-hex').fill('#503047');
  await page.waitForTimeout(250);
  const before = await getPreviewSignature(page);

  await page.getByRole('button', { name: 'Dark appearance' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Dark appearance' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'System appearance' }).click();
  await page.getByRole('button', { name: 'Light appearance' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await expect(page.locator('#dot-color-hex')).toHaveValue('#503047');
  expect(await getPreviewSignature(page)).toBe(before);

  await page.getByRole('button', { name: 'Dark appearance' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Dark appearance' })).toHaveAttribute('aria-pressed', 'true');
});
