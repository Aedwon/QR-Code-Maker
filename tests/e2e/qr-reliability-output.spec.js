import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openApp, openSection } from './helpers/app.js';
import { getPreviewSignature } from './helpers/preview.js';

const logo = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/logo.svg');
const ec = (page, level) => page.locator(`.ec-btn[data-value="${level}"]`);

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('error correction changes the capacity limit', async ({ page }) => {
  await openSection(page, 'scan-quality');
  await page.locator('#qr-data').fill('x'.repeat(1400));
  await expect(page.locator('#char-counter-text')).not.toContainText('too long');
  await ec(page, 'H').click();
  await expect(ec(page, 'H')).toHaveClass(/active/);
  await expect(page.locator('#char-counter-text')).toContainText('1273');
  await expect(page.locator('#char-counter-text')).toContainText('too long');
  await ec(page, 'L').click();
  await expect(page.locator('#char-counter-text')).not.toContainText('too long');
});

test('logo upload forces H and removal returns to Q', async ({ page }) => {
  await openSection(page, 'scan-quality');
  await ec(page, 'L').click();
  await openSection(page, 'logo');
  await page.locator('#logo-upload').setInputFiles(logo);
  await expect(page.locator('#logo-remove')).toBeVisible();
  await openSection(page, 'scan-quality');
  await expect(ec(page, 'H')).toHaveClass(/active/);
  await openSection(page, 'logo');
  await page.locator('#logo-remove').click();
  await openSection(page, 'scan-quality');
  await expect(ec(page, 'Q')).toHaveClass(/active/);
});

test('quiet zone and output size update the preview', async ({ page }) => {
  await openSection(page, 'scan-quality');
  const before = await getPreviewSignature(page);
  await page.locator('#qr-margin').fill('30');
  await expect(page.locator('#qr-margin-val')).toHaveText('30px');
  await expect.poll(() => getPreviewSignature(page)).not.toBe(before);

  await openSection(page, 'output');
  const mid = await getPreviewSignature(page);
  await page.locator('#qr-size').fill('500');
  await expect(page.locator('#qr-size-val')).toHaveText('500px');
  await expect.poll(() => getPreviewSignature(page)).not.toBe(mid);
});

for (const [id, ext] of [['export-png', 'png'], ['export-svg', 'svg'], ['export-jpeg', 'jpeg']]) {
  test(`${ext} export downloads qr-code.${ext}`, async ({ page }) => {
    await openSection(page, 'output');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator(`#${id}`).click(),
    ]);
    expect(download.suggestedFilename()).toBe(`qr-code.${ext}`);
  });
}

test('quick download in the workspace exports a PNG', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#quick-download-png').click(),
  ]);
  expect(download.suggestedFilename()).toBe('qr-code.png');
});
