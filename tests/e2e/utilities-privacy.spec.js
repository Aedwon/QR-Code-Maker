import { test, expect } from '@playwright/test';
import { openApp } from './helpers/app.js';

test('terms and privacy open and close; no feedback utility exists', async ({ page }) => {
  await openApp(page);
  await page.locator('#terms-link').click();
  await expect(page.locator('#terms-modal')).toBeVisible();
  await page.locator('#terms-close').click();
  await expect(page.locator('#terms-modal')).toBeHidden();

  await page.locator('#privacy-link').click();
  await expect(page.locator('#privacy-modal')).toBeVisible();
  await expect(page.locator('#privacy-modal')).toContainText('does not use analytics');
  await expect(page.locator('#privacy-modal')).not.toContainText('Web3Forms');
  await page.locator('#privacy-close').click();
  await expect(page.locator('#privacy-modal')).toBeHidden();

  await expect(page.locator('#feedback-link, #feedback-modal, #feedback-form')).toHaveCount(0);
});

test('app makes no analytics or feedback network requests', async ({ page }) => {
  const external = [];
  page.on('request', (req) => {
    const host = new URL(req.url()).hostname;
    if (host !== '127.0.0.1' && host !== 'localhost') external.push(host);
  });
  await openApp(page);
  await page.locator('#qr-data').fill('https://example.org');
  await page.waitForTimeout(400);
  expect(external.filter((h) => /googletagmanager|google-analytics|web3forms/.test(h))).toEqual([]);
});
