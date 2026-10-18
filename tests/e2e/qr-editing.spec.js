import { test, expect } from '@playwright/test';
import { openApp, expandAllSections } from './helpers/app.js';
import { getPreviewSignature } from './helpers/preview.js';

test.beforeEach(async ({ page }) => {
  await openApp(page);
  await expandAllSections(page);
});

test('content edits regenerate the preview after the debounce', async ({ page }) => {
  const before = await getPreviewSignature(page);
  await page.locator('#qr-data').fill('https://example.org/hello');
  await expect.poll(() => getPreviewSignature(page)).not.toBe(before);
  await expect(page.locator('#char-counter-text')).toContainText('25');
});

test('module shape selection updates active state and preview', async ({ page }) => {
  const before = await getPreviewSignature(page);
  const dots = page.locator('#dot-style-grid .style-btn[data-value="dots"]');
  await dots.click();
  await expect(dots).toHaveClass(/active/);
  await expect.poll(() => getPreviewSignature(page)).not.toBe(before);
});

test('module color hex and native input stay in sync and change the preview', async ({ page }) => {
  const before = await getPreviewSignature(page);
  await page.locator('#dot-color-hex').fill('#C05746');
  await expect(page.locator('#dot-color')).toHaveValue('#c05746');
  await expect.poll(() => getPreviewSignature(page)).not.toBe(before);
});

test('manual changes detach the active preset', async ({ page }) => {
  await page.locator('.preset-btn[data-preset="dots"]').click();
  await expect(page.locator('.preset-btn.active')).toHaveCount(1);
  await page.locator('#dot-style-grid .style-btn[data-value="rounded"]').click();
  await expect(page.locator('.preset-btn.active')).toHaveCount(0);
});

test('gradient round trip clears back to a flat color', async ({ page }) => {
  const flat = await getPreviewSignature(page);
  await page.locator('label:has(#dot-gradient-toggle)').click();
  await expect(page.locator('#dot-gradient-toggle')).toBeChecked();
  await expect(page.locator('#dot-gradient-controls')).toBeVisible();
  await page.locator('#dot-color-2-hex').fill('#503047');
  await expect.poll(() => getPreviewSignature(page)).not.toBe(flat);
  await page.locator('label:has(#dot-gradient-toggle)').click();
  await expect(page.locator('#dot-gradient-toggle')).not.toBeChecked();
  await expect(page.locator('#dot-gradient-controls')).toBeHidden();
  await expect.poll(() => getPreviewSignature(page)).toBe(flat);
});
